'use client';

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePayment } from "./hooks/index.payment.hook";

export default function GlossaryPayments() {
  const router = useRouter();
  const { handleSubscribe } = usePayment();

  const handleNavigateToList = () => {
    router.push('/magazines');
  };

  return (
    <div className="magazine-form-container magazine-payment-page">
      <button className="magazine-detail-back" onClick={handleNavigateToList}>
        <ArrowLeft className="magazine-detail-back-icon" />
        <span>목록으로</span>
      </button>
      <div className="magazine-form-header">
        <h1>IT 매거진 구독</h1>
        <p className="magazine-form-subtitle">프리미엄 콘텐츠를 제한 없이 이용하세요</p>
      </div>

      <div className="payment-content">
        <div className="payment-card">
          <div className="payment-card-header">
            <h2 className="payment-plan-title">월간 구독</h2>
            <p className="payment-plan-description">
              모든 IT 매거진 콘텐츠에 무제한 접근
            </p>
          </div>

          <div className="payment-card-body">
            <div className="payment-price-section">
              <span className="payment-price">9,900원</span>
              <span className="payment-period">/월</span>
            </div>

            <div className="payment-features">
              <div className="payment-feature-item">
                <svg className="payment-check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>모든 프리미엄 아티클 열람</span>
              </div>
              <div className="payment-feature-item">
                <svg className="payment-check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>최신 기술 트렌드 리포트</span>
              </div>
              <div className="payment-feature-item">
                <svg className="payment-check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>광고 없는 읽기 환경</span>
              </div>
              <div className="payment-feature-item">
                <svg className="payment-check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>언제든지 구독 취소 가능</span>
              </div>
            </div>

            <button 
              className="payment-subscribe-button"
              onClick={handleSubscribe}
            >
              구독하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
