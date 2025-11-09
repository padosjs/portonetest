import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SubmitData {
  category: string;
  title: string;
  description: string;
  content: string;
  tags: string[] | null;
  imageFile: File | null;
}

export const useSubmitMagazine = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitMagazine = async (data: SubmitData): Promise<string | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl: string | null = null;

      // Step 1: 이미지 파일이 있으면 Supabase Storage에 업로드
      if (data.imageFile) {
        // 날짜 기반 경로 생성 (yyyy/mm/dd)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        
        // UUID 생성
        const uuid = crypto.randomUUID();
        
        // 파일 확장자 추출
        const fileExtension = data.imageFile.name.split('.').pop() || 'jpg';
        
        // 파일명: yyyy/mm/dd/{UUID}.jpg
        const filePath = `${year}/${month}/${day}/${uuid}.${fileExtension}`;

        // Supabase Storage에 업로드
        const { error: uploadError } = await supabase.storage
          .from('vibe-coding-storage')
          .upload(filePath, data.imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
        }

        // 업로드된 이미지의 Public URL 가져오기
        const { data: publicUrlData } = supabase.storage
          .from('vibe-coding-storage')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // Step 2: magazine 테이블에 데이터 등록
      const { data: insertedData, error: insertError } = await supabase
        .from('magazine')
        .insert([
          {
            category: data.category,
            title: data.title,
            description: data.description,
            content: data.content,
            tags: data.tags,
            image_url: imageUrl
          }
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (!insertedData) {
        throw new Error('데이터 등록에 실패했습니다.');
      }

      // Step 3: 등록 성공 - 생성된 ID 반환
      return insertedData.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Magazine 등록 오류:', err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitMagazine,
    isSubmitting,
    error
  };
};

