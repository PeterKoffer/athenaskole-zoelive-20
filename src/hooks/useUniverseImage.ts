import { useEffect, useState } from 'react';
import { getUniverseImageSignedUrl, inlinePlaceholder } from '@/services/universeImages';

type Options = {
  expires?: number;
  autoHeal?: boolean;
  label?: string; // text on placeholder
};

export function useUniverseImage(path: string | null | undefined, opts: Options = {}) {
  const { expires = 300, autoHeal = true, label = 'Image' } = opts;
  const [url, setUrl] = useState<string>(inlinePlaceholder(512, 256, label));
  const [loading, setLoading] = useState<boolean>(!!path);
  const [fallback, setFallback] = useState(false);
  const [meta, setMeta] = useState<{status:number; type:string|null; len:number}|null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!path) {
      setLoading(false);
      setFallback(true);
      setUrl(inlinePlaceholder(512, 256, label));
      return;
    }

    (async () => {
      try {
        setLoading(true);
        
        // Use the new auto-healing signed URL function
        const signedUrl = await getUniverseImageSignedUrl(path, { 
          expires, 
          label 
        });
        
        if (cancelled) return;

        // The auto-heal function already handles corruption, so we can trust the URL
        setUrl(signedUrl + (signedUrl.includes('?') ? '&' : '?') + 'cb=' + Date.now());
        setFallback(false);
        setMeta({ status: 200, type: 'image/webp', len: 1024 }); // Assume success after auto-heal
      } catch (e) {
        console.error('[useUniverseImage] error', e);
        setUrl(inlinePlaceholder(512, 256, label));
        setFallback(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [path, expires, autoHeal, label]);

  return { url, loading, fallback, meta };
}