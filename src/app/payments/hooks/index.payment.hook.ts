import { useRouter } from "next/navigation";

declare global {
  interface Window {
    PortOne?: {
      requestIssueBillingKey: (params: {
        storeId: string;
        channelKey: string;
        billingKeyMethod: string;
      }) => Promise<{
        code?: string;
        message?: string;
        billingKey?: string;
      }>;
    };
  }
}

export const usePayment = () => {
  const router = useRouter();

  /**
   * 빌링키 발급 및 구독 결제 처리
   */
  const handleSubscribe = async () => {
    try {
      // 1. 환경 변수 확인
      const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
      const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;

      if (!storeId || !channelKey) {
        alert("포트원 설정이 누락되었습니다. 환경 변수를 확인해주세요.");
        return;
      }

      // 2. PortOne SDK 확인
      if (!window.PortOne) {
        alert("포트원 SDK가 로드되지 않았습니다.");
        return;
      }

      // 3. 빌링키 발급 요청
      const issueResponse = await window.PortOne.requestIssueBillingKey({
        storeId,
        channelKey,
        billingKeyMethod: "CARD",
      });

      // 4. 빌링키 발급 실패 처리
      if (issueResponse.code || !issueResponse.billingKey) {
        alert(
          `빌링키 발급에 실패했습니다: ${
            issueResponse.message || "알 수 없는 오류"
          }`
        );
        return;
      }

      // 5. 빌링키로 결제 API 요청
      const paymentApiResponse = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billingKey: issueResponse.billingKey,
          orderName: "IT 매거진 월간 구독",
          amount: 9900,
          customer: {
            id: `customer_${Date.now()}`, // 실제로는 로그인한 사용자 ID를 사용해야 함
          },
        }),
      });

      const paymentResult = await paymentApiResponse.json();

      // 6. 결제 실패 처리
      if (!paymentResult.success) {
        alert(
          `결제에 실패했습니다: ${
            paymentResult.error || "알 수 없는 오류"
          }`
        );
        return;
      }

      // 7. 결제 성공 처리
      alert("구독에 성공하였습니다.");
      router.push("/magazines");
    } catch (error) {
      console.error("구독 처리 중 오류:", error);
      alert("구독 처리 중 오류가 발생했습니다.");
    }
  };

  return {
    handleSubscribe,
  };
};

