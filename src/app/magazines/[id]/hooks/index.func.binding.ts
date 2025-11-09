'use client';

import { useState, useEffect } from 'react';
import { supabase, Magazine } from '@/lib/supabase';

interface UseMagazineDetailResult {
  magazine: Magazine | null;
  loading: boolean;
  error: string | null;
}

export function useMagazineDetail(id: string): UseMagazineDetailResult {
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMagazine() {
      try {
        setLoading(true);
        setError(null);

        // 1-1) 매거진 데이터 조회
        const { data, error: fetchError } = await supabase
          .from('magazine')
          .select('id, image_url, category, title, description, content, tags')
          .eq('id', id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          throw new Error('Magazine not found');
        }

        // 1-2) 썸네일 URL 생성 (Supabase Image Transformation)
        let thumbnailUrl = data.image_url;
        if (data.image_url) {
          // Storage 경로에서 파일 경로 추출
          // 예: https://xxx.supabase.co/storage/v1/object/public/vibe-coding-storage/path/to/file.jpg
          // 또는 storage 경로만: path/to/file.jpg
          const bucketName = 'vibe-coding-storage';
          
          // 이미 전체 URL인지, 아니면 경로만 있는지 확인
          let filePath = data.image_url;
          if (data.image_url.includes('/storage/v1/object/public/')) {
            // 전체 URL에서 파일 경로 추출
            const parts = data.image_url.split(`/storage/v1/object/public/${bucketName}/`);
            if (parts.length > 1) {
              filePath = parts[1];
            }
          }
          
          // getPublicUrl with Image Transformation
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath, {
              transform: {
                width: 852,
                resize: 'contain'
              }
            });
          
          thumbnailUrl = urlData.publicUrl;
        }

        // 1-3) 실제 데이터로 교체
        setMagazine({
          ...data,
          image_url: thumbnailUrl
        });
      } catch (err) {
        console.error('Error fetching magazine:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch magazine');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchMagazine();
    }
  }, [id]);

  return { magazine, loading, error };
}

