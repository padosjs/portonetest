'use client';

import { useRouter } from 'next/navigation';
import { LogIn, PenSquare, Sparkles } from "lucide-react";
import { useMagazines } from './index.binding.hook';

const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    "인공지능": "magazine-category-ai",
    "웹개발": "magazine-category-web",
    "클라우드": "magazine-category-cloud",
    "보안": "magazine-category-security",
    "모바일": "magazine-category-mobile",
    "데이터사이언스": "magazine-category-data",
    "블록체인": "magazine-category-blockchain",
    "DevOps": "magazine-category-devops",
  };
  
  return colorMap[category] || "magazine-category-default";
};

export default function GlossaryCards() {
  const router = useRouter();
  const { magazines, loading, error } = useMagazines();

  const handleCardClick = (id: string) => {
    router.push(`/magazines/${id}`);
  };

  return (
    <div className="magazine-container">
      <div className="magazine-header">
        <h1>IT 매거진</h1>
        <p className="magazine-subtitle">최신 기술 트렌드와 인사이트를 전합니다</p>
        <div className="magazine-header-actions">
          <button 
            className="magazine-header-button magazine-header-button-ghost"
            onClick={() => router.push('/auth/login')}
          >
            <LogIn className="magazine-button-icon" />
            <span className="magazine-button-text">로그인</span>
          </button>
          <button 
            className="magazine-header-button magazine-header-button-primary"
            onClick={() => router.push('/magazines/new')}
          >
            <PenSquare className="magazine-button-icon" />
            <span className="magazine-button-text">글쓰기</span>
          </button>
          <button 
            className="magazine-header-button magazine-header-button-payment"
            onClick={() => router.push('/payments')}
          >
            <Sparkles className="magazine-button-icon" />
            <span className="magazine-button-text">구독하기</span>
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="magazine-loading">
          <p>데이터를 불러오는 중...</p>
        </div>
      )}

      {error && (
        <div className="magazine-error">
          <p>오류: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="magazine-grid">
          {magazines.map((magazine) => (
            <article 
              key={magazine.id} 
              className="magazine-card"
              onClick={() => handleCardClick(magazine.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="magazine-card-image">
                <img 
                  src={magazine.image_url ?? ''}
                  alt={magazine.title}
                />
                <div className={`magazine-card-category ${getCategoryColor(magazine.category)}`}>
                  {magazine.category}
                </div>
              </div>
              
              <div className="magazine-card-content">
                <h2 className="magazine-card-title">{magazine.title}</h2>
                <p className="magazine-card-summary">{magazine.description}</p>
                
                {magazine.tags && magazine.tags.length > 0 && (
                  <div className="magazine-card-tags">
                    {magazine.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="magazine-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
