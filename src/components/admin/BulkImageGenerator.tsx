import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Image, CheckCircle, AlertCircle } from 'lucide-react';

interface BulkJobResult {
  jobId: string;
  total: number;
  success: number;
  failed: number;
  skipped: number;
  batches: number;
  message: string;
}

export function BulkImageGenerator() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<BulkJobResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runBulkGeneration = async () => {
    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      console.log('🚀 Starting bulk universe image generation...');
      
      const { data, error } = await supabase.functions.invoke('image-ensure', {
        body: {},
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to start bulk generation');
      }

      setResult(data);
      console.log('✅ Bulk generation completed:', data);
      
    } catch (err: any) {
      console.error('❌ Bulk generation failed:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setIsRunning(false);
    }
  };

  const progressPercentage = result ? Math.round((result.success / result.total) * 100) : 0;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Bulk Universe Image Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate AI images for all universes without existing images. This will scan your content and create beautiful illustrations.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runBulkGeneration} 
          disabled={isRunning}
          className="w-full"
          size="lg"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Images...
            </>
          ) : (
            <>
              <Image className="w-4 h-4 mr-2" />
              Start Bulk Generation
            </>
          )}
        </Button>

        {isRunning && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing universes in batches...
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">Generation Completed!</span>
            </div>
            
            <Progress value={progressPercentage} className="w-full" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{result.success}</div>
                <div className="text-sm text-muted-foreground">Success</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{result.skipped}</div>
                <div className="text-sm text-muted-foreground">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{result.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{result.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                Job ID: {result.jobId.slice(0, 8)}...
              </Badge>
              <Badge variant="outline">
                {result.batches} batches processed
              </Badge>
              <Badge variant={result.success === result.total ? "default" : "secondary"}>
                {progressPercentage}% success rate
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {result.message}
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Generation Failed</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p><strong>Note:</strong> This process may take several minutes depending on the number of universes. Images are cached and will only be generated once per universe.</p>
        </div>
      </CardContent>
    </Card>
  );
}