import { useState, useEffect } from 'react';
import { healAndGetSignedUrl } from '../services/storage/getSignedUrl';

interface UseUniverseCoverProps {
  universeId: string;
  title: string;
  subject: string;
  grade: number | string;
}

export function useUniverseCover({ universeId, title, subject, grade }: UseUniverseCoverProps) {
  const [src, setSrc] = useState<string>('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const pathBase = `${universeId}/cover`;
        const url = await healAndGetSignedUrl(pathBase, {
          title,
          subject,
          label: `${title} - ${subject} Grade ${grade}`
        });
        setSrc(url);
        setReady(true);
      } catch (error) {
        console.error('Failed to load universe cover:', error);
        setReady(true);
      }
    };

    loadImage();
  }, [universeId, title, subject, grade]);

  return { src, ready };
}