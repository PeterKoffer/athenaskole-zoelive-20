import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface DiagnosticResult {
  url: string;
  status: number;
  accessible: boolean;
  error?: string;
}

export function UniverseImageDiagnostic() {
  const [universeId, setUniverseId] = useState('');
  const [subject, setSubject] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);

  const testImageAccess = async (url: string): Promise<DiagnosticResult> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return {
        url,
        status: response.status,
        accessible: response.ok,
      };
    } catch (error) {
      return {
        url,
        status: 0,
        accessible: false,
        error: String(error),
      };
    }
  };

  const runDiagnostic = async () => {
    if (!universeId.trim()) {
      alert('Please enter a universe ID');
      return;
    }

    setIsRunning(true);
    setResults([]);

    const baseUrl = 'https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images';
    const subjectMap: Record<string, string> = {
      mathematics: "math.png",
      science: "science.png", 
      geography: "geography.png",
      "computer-science": "computer-science.png",
      music: "music.png",
      "creative-arts": "arts.png",
      "body-lab": "pe.png",
      "life-essentials": "life.png",
      "history-religion": "history.png",
      languages: "languages.png",
      "mental-wellness": "wellness.png",
      default: "default.png",
    };

    const testUrls = [
      `${baseUrl}/${universeId.trim()}.png`,
      subject ? `${baseUrl}/${subjectMap[subject] || 'default.png'}` : null,
      `${baseUrl}/default.png`,
    ].filter(Boolean) as string[];

    console.log('🔍 Testing image URLs:', testUrls);

    const testResults = await Promise.all(
      testUrls.map(url => testImageAccess(url))
    );

    setResults(testResults);
    setIsRunning(false);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Universe Image Diagnostic
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Test image accessibility to diagnose display issues in Daily Program.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="universeId" className="text-sm font-medium">
              Universe ID
            </label>
            <Input
              id="universeId"
              value={universeId}
              onChange={(e) => setUniverseId(e.target.value)}
              placeholder="e.g., start-a-clothing-brand"
              disabled={isRunning}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject (optional)
            </label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., science, mathematics"
              disabled={isRunning}
            />
          </div>
        </div>

        <Button 
          onClick={runDiagnostic} 
          disabled={isRunning || !universeId.trim()}
          className="w-full"
          size="lg"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running Diagnostic...
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 mr-2" />
              Test Image Access
            </>
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Diagnostic Results:</h3>
            
            {results.map((result, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                {result.accessible ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={result.accessible ? "default" : "destructive"}>
                      {result.status || 'Network Error'}
                    </Badge>
                    <span className="text-sm font-medium">
                      {result.accessible ? 'Accessible' : 'Not Accessible'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground break-all">
                    {result.url}
                  </div>
                  
                  {result.error && (
                    <div className="text-xs text-red-600 mt-1">
                      Error: {result.error}
                    </div>
                  )}
                  
                  {result.accessible && (
                    <div className="mt-2">
                      <img 
                        src={result.url} 
                        alt="Test"
                        className="w-20 h-12 object-cover rounded border"
                        onError={() => {
                          console.error('Failed to load image preview:', result.url);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Interpretation:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>200:</strong> Image exists and is accessible</li>
                <li><strong>404:</strong> Image file not found in Storage</li>
                <li><strong>403:</strong> Access denied (check bucket policies)</li>
                <li><strong>Network Error:</strong> CORS or connection issue</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}