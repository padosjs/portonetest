'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    console.log("구글 로그인 시도");
    alert("구글 로그인 기능은 데모용입니다.");
  };

  const handleBrowseWithoutLogin = () => {
    router.push('/magazines');
  };

  return (
    <div className="magazine-login-container">
      <div className="magazine-login-box">
        <div className="magazine-login-icon-container">
          <div className="magazine-login-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
        </div>

        <div className="magazine-login-header">
          <h1>IT 매거진</h1>
          <p className="magazine-login-subtitle">최신 기술 트렌드와 인사이트를 한곳에서</p>
          <p className="magazine-login-description">
            로그인하고 개인 맞춤형 콘텐츠를 추천받으세요
          </p>
        </div>

        <div className="magazine-login-social-buttons">
          <button 
            type="button" 
            className="magazine-login-google-button"
            onClick={handleGoogleLogin}
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z" fill="#4285F4"/>
              <path d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z" fill="#34A853"/>
              <path d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40665 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.54755 0 8.99983C0 10.4521 0.347727 11.8266 0.957273 13.0416L3.96409 10.7098Z" fill="##FBBC05"/>
              <path d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z" fill="#EA4335"/>
            </svg>
            Google로 계속하기
          </button>
        </div>

        <div className="magazine-login-divider">
          <span>또는</span>
        </div>

        <button 
          type="button" 
          className="magazine-login-browse-button"
          onClick={handleBrowseWithoutLogin}
        >
          로그인 없이 무료 콘텐츠 둘러보기
        </button>

        <div className="magazine-login-footer">
          <p className="magazine-login-footer-text">
            로그인하면 <a href="#" className="magazine-login-link">이용약관</a> 및 <a href="#" className="magazine-login-link">개인정보처리방침</a>에 동의하게 됩니다
          </p>
        </div>

        <div className="magazine-login-features">
          <div className="magazine-login-feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>무료 회원가입</span>
          </div>
          <div className="magazine-login-feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <span>맞춤형 콘텐츠 추천</span>
          </div>
          <div className="magazine-login-feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>북마크 & 저장</span>
          </div>
        </div>
      </div>
    </div>
  );
}
