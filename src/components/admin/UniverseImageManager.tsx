import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { invokeFn } from '@/supabase/functionsClient';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface RegenerateResult {
  imageUrl: string;
  from: 'ai' | 'fallback';
  duration_ms: number;
  error?: string;
}

export function UniverseImageManager() {
  const { user, loading: authLoading } = useAuth();
  const [universeId, setUniverseId] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [result, setResult] = useState<RegenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const regenerateImage = async () => {
    if (!universeId.trim()) {
      setError('Please enter a universe ID');
      return;
    }

    if (authLoading || !user) return;

    setIsRegenerating(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔄 Regenerating image for universe:', universeId);
      
      // First clear the cache to force regeneration
      const { error: deleteError } = await supabase
        .from('universe_images')
        .delete()
        .eq('universe_id', universeId);

      if (deleteError) {
        console.warn('Could not clear cache:', deleteError);
      }

      const { data: meta } = await supabase
        .from('universes')
        .select('title, subject')
        .eq('id', universeId.trim())
        .single();

      const data = await invokeFn('image-ensure', {
        universeId: universeId.trim(),
        universeTitle: meta?.title || universeId.trim(),
        subject: meta?.subject || 'education',
        scene: 'cover: main activity',
        grade: 6
      });

      setResult(data as RegenerateResult);
      console.log('✅ Image regenerated:', data);
      
    } catch (err: any) {
      console.error('❌ Image regeneration failed:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Universe Image Manager
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Regenerate AI images for specific universes. This will clear the cache and create a new image.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="universeId" className="text-sm font-medium">
            Universe ID
          </label>
          <Input
            id="universeId"
            value={universeId}
            onChange={(e) => setUniverseId(e.target.value)}
            placeholder="e.g., start-a-clothing-brand"
            disabled={isRegenerating}
          />
        </div>

        <Button 
          onClick={regenerateImage} 
          disabled={isRegenerating || !universeId.trim()}
          className="w-full"
          size="lg"
        >
          {isRegenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Regenerating Image...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Image
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">Image Regenerated!</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">New Image</div>
                <img 
                  src={result.imageUrl} 
                  alt={`Generated image for ${universeId}`}
                  className="w-full h-32 object-cover rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg?height=128&width=256&text=Failed+to+Load';
                  }}
                />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Details</div>
                <div className="space-y-1">
                  <Badge variant={result.from === 'ai' ? 'default' : 'secondary'}>
                    Source: {result.from}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    Generated in {result.duration_ms}ms
                  </div>
                  <div className="text-xs text-muted-foreground break-all">
                    URL: {result.imageUrl}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Regeneration Failed</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p><strong>Note:</strong> Regenerating will clear the existing cache and create a new AI image. This may take a few seconds to complete.</p>
        </div>
      </CardContent>
    </Card>
  );
}