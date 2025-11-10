import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

/**
 * POST /api/portone
 * PortOne 웹훅을 처리하는 API!
 * 구독 결제 완료 시 결제 정보를 DB에 저장하고 다음달 구독을 예약합니다.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 요청 데이터 파싱
    const body = await request.json();
    const { payment_id, status } = body;

    // 1-1. 필수 데이터 검증
    if (!payment_id || !status) {
      return NextResponse.json(
        { success: false, error: "필수 데이터가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 1-2. status 유효성 검증
    if (status !== "Paid" && status !== "Cancelled") {
      return NextResponse.json(
        { success: false, error: "유효하지 않은 status입니다." },
        { status: 400 }
      );
    }

    // 1-3. 환경 변수 확인
    const PORTONE_API_SECRET = process.env.PORTONE_API_SECRET;
    if (!PORTONE_API_SECRET) {
      return NextResponse.json(
        { success: false, error: "PORTONE_API_SECRET이 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // 2. 구독결제완료시나리오 (status가 "Paid"일 때만 처리)
    if (status === "Paid") {
      // 2-1) paymentId의 결제정보를 조회
      const paymentResponse = await fetch(
        `https://api.portone.io/payments/${encodeURIComponent(payment_id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `PortOne ${PORTONE_API_SECRET}`,
          },
        }
      );

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        console.error("PortOne 결제 정보 조회 실패:", errorData);
        return NextResponse.json(
          {
            success: false,
            error: "결제 정보 조회에 실패했습니다.",
            details: errorData,
          },
          { status: paymentResponse.status }
        );
      }

      const paymentInfo = await paymentResponse.json();

      // 2-2) 현재 시각 계산
      const now = new Date();
      const startAt = now.toISOString();

      // end_at: 현재시각 + 30일
      const endAt = new Date(now);
      endAt.setDate(endAt.getDate() + 30);
      const endAtISO = endAt.toISOString();

      // end_grace_at: 현재시각 + 31일
      const endGraceAt = new Date(now);
      endGraceAt.setDate(endGraceAt.getDate() + 31);
      const endGraceAtISO = endGraceAt.toISOString();

      // next_schedule_at: end_at + 1일 오전 10시~11시 사이 임의 시각
      const nextScheduleAt = new Date(endAt);
      nextScheduleAt.setDate(nextScheduleAt.getDate() + 1);
      nextScheduleAt.setHours(10, Math.floor(Math.random() * 60), 0, 0); // 10시 00분 ~ 10시 59분
      const nextScheduleAtISO = nextScheduleAt.toISOString();

      // next_schedule_id: 임의로 생성한 UUID
      const nextScheduleId = randomUUID();

      // 2-3) supabase의 payment 테이블에 등록
      const { error: insertError } = await supabase.from("payment").insert({
        transaction_key: paymentInfo.paymentId || payment_id,
        amount: paymentInfo.amount?.total || paymentInfo.amount || 0,
        status: "Paid",
        start_at: startAt,
        end_at: endAtISO,
        end_grace_at: endGraceAtISO,
        next_schedule_at: nextScheduleAtISO,
        next_schedule_id: nextScheduleId,
      });

      if (insertError) {
        console.error("Supabase 저장 실패:", insertError);
        return NextResponse.json(
          {
            success: false,
            error: "결제 정보 저장에 실패했습니다.",
            details: insertError.message,
          },
          { status: 500 }
        );
      }

      // 3. 다음달구독예약시나리오
      // 3-1) 포트원에 다음달 구독결제를 예약
      const scheduleResponse = await fetch(
        `https://api.portone.io/payments/${encodeURIComponent(
          nextScheduleId
        )}/schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `PortOne ${PORTONE_API_SECRET}`,
          },
          body: JSON.stringify({
            payment: {
              billingKey: paymentInfo.billingKey,
              orderName: paymentInfo.orderName,
              customer: {
                id: paymentInfo.customer?.id,
              },
              amount: {
                total: paymentInfo.amount?.total || paymentInfo.amount || 0,
              },
              currency: "KRW",
            },
            timeToPay: nextScheduleAtISO,
          }),
        }
      );

      if (!scheduleResponse.ok) {
        const scheduleError = await scheduleResponse.json();
        console.error("PortOne 구독 예약 실패:", scheduleError);
        // 예약 실패해도 결제는 완료되었으므로 성공으로 처리하되 로그만 남김
        console.warn("구독 예약 실패했지만 결제는 완료되었습니다.");
      }
    }

    // 4. 성공 응답 반환
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("API 처리 중 오류:", error);
    return NextResponse.json(
      {
        success: false,
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

