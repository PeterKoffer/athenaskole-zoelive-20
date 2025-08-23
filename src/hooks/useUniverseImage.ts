import { useEffect, useState } from 'react';
import { ensureAndSign, headOk, inlinePlaceholder } from '@/services/universeImages';

type Options = {
  expires?: number;
  minBytes?: number;
  label?: string; // tekst på placeholder
};

export function useUniverseImage(path: string | null | undefined, opts: Options = {}) {
  const { expires = 300, minBytes = 128, label = 'Image' } = opts;
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
        const signed = await ensureAndSign(path, expires);
        if (cancelled) return;

        const head = await headOk(signed, minBytes);
        if (cancelled) return;

        setMeta({ status: head.status, type: head.type, len: parseInt((head as any).len ?? '0', 10) });

        if (head.ok) {
          setUrl(signed + (signed.includes('?') ? '&' : '?') + 'cb=' + Date.now()); // cache-buster
          setFallback(false);
        } else {
          setUrl(inlinePlaceholder(512, 256, label));
          setFallback(true);
        }
      } catch (e) {
        console.error('[useUniverseImage] error', e);
        setUrl(inlinePlaceholder(512, 256, label));
        setFallback(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [path, expires, minBytes, label]);

  return { url, loading, fallback, meta };
}