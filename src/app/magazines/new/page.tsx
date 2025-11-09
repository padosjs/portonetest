"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSubmitMagazine } from "./hooks/index.submit.hook";

interface FormData {
  category: string;
  title: string;
  summary: string;
  content: string;
  tags: string;
}

const CATEGORIES = [
  "인공지능",
  "웹개발",
  "클라우드",
  "보안",
  "모바일",
  "데이터사이언스",
  "블록체인",
  "DevOps"
];

function CustomDropdown({ 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  options: string[]; 
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="custom-dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? '' : 'custom-dropdown-placeholder'}>
          {value || placeholder}
        </span>
        <svg 
          className={`custom-dropdown-icon ${isOpen ? 'open' : ''}`}
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      {isOpen && (
        <div className="custom-dropdown-menu">
          {options.map((option) => (
            <div
              key={option}
              className={`custom-dropdown-item ${value === option ? 'selected' : ''}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
              {value === option && (
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const { submitMagazine, isSubmitting, error } = useSubmitMagazine();
  
  const onNavigateToList = () => {
    window.location.href = '/magazines';
  };
  const [formData, setFormData] = useState<FormData>({
    category: "",
    title: "",
    summary: "",
    content: "",
    tags: ""
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 태그 배열 변환
    const tagsArray = formData.tags
      .split(" ")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // 1-1) magazine 테이블에 데이터 등록 (이미지 포함)
    const magazineId = await submitMagazine({
      category: formData.category,
      title: formData.title,
      description: formData.summary, // summary를 description으로 매핑
      content: formData.content,
      tags: tagsArray.length > 0 ? tagsArray : null,
      imageFile: imageFile // 이미지 파일 전달
    });

    // 1-2) 등록 성공 이후 로직
    if (magazineId) {
      // 알림메시지
      alert("등록에 성공하였습니다.");
      
      // 이동할페이지: "/magazines/[id]"
      router.push(`/magazines/${magazineId}`);
    } else {
      // 에러 처리
      alert(error || "등록에 실패했습니다.");
    }
  };

  return (
    <div className="magazine-form-container">
      <button className="magazine-detail-back" onClick={onNavigateToList}>
        <ArrowLeft className="magazine-detail-back-icon" />
        <span>목록으로</span>
      </button>

      <div className="magazine-form-header">
        <h1>새 아티클 등록</h1>
        <p className="magazine-form-subtitle">IT 매거진에 새로운 기술 아티클을 등록합니다</p>
      </div>

      <form className="magazine-form" onSubmit={handleSubmit}>
        <div className="magazine-form-group">
          <label className="magazine-form-label">
            이미지 파일
          </label>
          
          {!imagePreview ? (
            <div 
              className={`magazine-file-upload-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                className="magazine-file-input-hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="imageFile" className="magazine-file-upload-label">
                <div className="magazine-file-upload-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
                <div className="magazine-file-upload-text">
                  <span className="magazine-file-upload-primary">클릭하여 이미지 선택</span>
                  <span className="magazine-file-upload-secondary">또는 드래그 앤 드롭</span>
                </div>
                <p className="magazine-file-upload-hint">JPG, PNG, GIF (최대 10MB)</p>
              </label>
            </div>
          ) : (
            <div className="magazine-form-preview">
              <img src={imagePreview} alt="미리보기" className="magazine-form-preview-image" />
              <button 
                type="button" 
                className="magazine-preview-remove"
                onClick={() => {
                  setImagePreview('');
                  setImageFile(null);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                이미지 제거
              </button>
            </div>
          )}
        </div>

        <div className="magazine-form-group">
          <label className="magazine-form-label">
            카테고리 <span className="required-mark">*</span>
          </label>
          <CustomDropdown
            value={formData.category}
            onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            options={CATEGORIES}
            placeholder="카테고리를 선택해주세요"
          />
        </div>

        <div className="magazine-form-group">
          <label className="magazine-form-label" htmlFor="title">
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="magazine-form-input"
            placeholder="예: 2025년 AI 트렌드: 생성형 AI의 진화"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="magazine-form-group">
          <label className="magazine-form-label" htmlFor="summary">
            한줄 소개
          </label>
          <input
            type="text"
            id="summary"
            name="summary"
            className="magazine-form-input"
            placeholder="아티클을 간단히 소개해주세요 (1-2문장)"
            value={formData.summary}
            onChange={handleChange}
            required
          />
        </div>

        <div className="magazine-form-group">
          <label className="magazine-form-label" htmlFor="content">
            상세 내용
          </label>
          <textarea
            id="content"
            name="content"
            className="magazine-form-textarea"
            placeholder="아티클의 상세 내용을 작성해주세요..."
            value={formData.content}
            onChange={handleChange}
            rows={10}
            required
          />
        </div>

        <div className="magazine-form-group">
          <label className="magazine-form-label" htmlFor="tags">
            태그
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            className="magazine-form-input"
            placeholder="#React #TypeScript #JavaScript"
            value={formData.tags}
            onChange={handleChange}
          />
          <p className="magazine-form-hint">공백으로 구분하여 입력해주세요 (예: #React #Node.js #WebDev)</p>
        </div>

        <button 
          type="submit" 
          className="magazine-form-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? '등록 중...' : '아티클 등록하기'}
        </button>
      </form>
    </div>
  );
}
