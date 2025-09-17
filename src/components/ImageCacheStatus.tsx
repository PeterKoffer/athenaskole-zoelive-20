import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface ImageCacheStatusProps {
  imageUrl?: string;
  universeId?: string;
}

export function ImageCacheStatus({ imageUrl, universeId }: ImageCacheStatusProps) {
  const [cacheStatus, setCacheStatus] = useState<'checking' | 'cached' | 'generated' | 'fallback'>('checking');

  useEffect(() => {
    if (!imageUrl) {
      setCacheStatus('fallback');
      return;
    }

    // Simple heuristic to determine cache status
    if (imageUrl.includes('universe-images')) {
      setCacheStatus('cached');
    } else if (imageUrl.includes('/images/')) {
      setCacheStatus('fallback');
    } else {
      setCacheStatus('generated');
    }
  }, [imageUrl]);

  const statusConfig = {
    checking: { label: 'Checking...', variant: 'secondary' as const },
    cached: { label: '✓ Cached', variant: 'secondary' as const },
    generated: { label: '⚡ Generated', variant: 'default' as const },
    fallback: { label: '📁 Fallback', variant: 'outline' as const },
  };

  const config = statusConfig[cacheStatus];

  return (
    <Badge variant={config.variant} className="text-xs">
      {config.label}
    </Badge>
  );
}