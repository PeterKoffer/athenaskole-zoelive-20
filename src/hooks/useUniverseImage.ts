import { useEffect, useState } from 'react';
import { getUniverseImageSignedUrl } from '@/services/universeImages';

export function useUniverseImage(path?: string, expires = 300) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let alive = true;
    if (!path) { 
      setUrl(null); 
      setLoading(false); 
      setError(null); 
      return; 
    }
    
    setLoading(true); 
    setError(null);
    
    getUniverseImageSignedUrl(path, expires)
      .then(u => { if (alive) setUrl(u); })
      .catch(e => { if (alive) setError(e); })
      .finally(() => { if (alive) setLoading(false); });
      
    return () => { alive = false; };
  }, [path, expires]);

  return { url, loading, error };
}