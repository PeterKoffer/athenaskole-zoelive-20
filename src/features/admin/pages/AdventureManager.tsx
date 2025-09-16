import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Image, RefreshCw } from 'lucide-react';
import { AdventureImageService } from '@/services/AdventureImageService';
import { toast } from 'sonner';

export default function AdventureManager() {
  const [importing, setImporting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState<{
    total: number;
    childGenerated: number;
    teenGenerated: number;
    adultGenerated: number;
  } | null>(null);

  const handleImportAdventures = async () => {
    setImporting(true);
    try {
      // Import the 300 adventures from the JSON file
      const response = await fetch('/src/data/image_jobs_300.json');
      const adventures = await response.json();
      
      const result = await AdventureImageService.importAdventures(adventures);
      
      toast.success(`Import completed: ${result.imported} imported, ${result.skipped} skipped, ${result.errors} errors`);
      await loadStatus();
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Failed to import adventures');
    } finally {
      setImporting(false);
    }
  };

  const handleGenerateImages = async (ageGroups: string[] = ['child', 'teen', 'adult']) => {
    setGenerating(true);
    try {
      const result = await AdventureImageService.generateAgeImages({
        batchSize: 3,
        ageGroups: ageGroups as any
      });
      
      toast.success(`Generated ${result.successful} images successfully`);
      await loadStatus();
    } catch (error) {
      console.error('Image generation failed:', error);
      toast.error('Failed to generate images');
    } finally {
      setGenerating(false);
    }
  };

  const loadStatus = async () => {
    try {
      const statusData = await AdventureImageService.getAdventuresStatus();
      setStatus(statusData);
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  const getProgress = (generated: number, total: number) => {
    return total > 0 ? Math.round((generated / total) * 100) : 0;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Adventure Manager</h1>
        <p className="text-muted-foreground">
          Import adventures and generate age-appropriate images
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Import Adventures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Adventures
            </CardTitle>
            <CardDescription>
              Import 300 adventure ideas from JSON file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleImportAdventures}
              disabled={importing}
              className="w-full"
            >
              {importing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import 300 Adventures
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generate Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Generate Images
            </CardTitle>
            <CardDescription>
              Generate age-appropriate images for adventures
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => handleGenerateImages()}
              disabled={generating}
              className="w-full"
            >
              {generating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Image className="mr-2 h-4 w-4" />
                  Generate All Age Groups
                </>
              )}
            </Button>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateImages(['child'])}
                disabled={generating}
              >
                Child (0-4)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateImages(['teen'])}
                disabled={generating}
              >
                Teen (5-8)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateImages(['adult'])}
                disabled={generating}
              >
                Adult (9+)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Display */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Generation Status</CardTitle>
            <CardDescription>
              Track progress of image generation for all age groups
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadStatus}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {status ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Adventures</span>
                <Badge variant="secondary">{status.total}</Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Child Images (0-4 grade)</span>
                    <span className="text-sm text-muted-foreground">
                      {status.childGenerated} / {status.total}
                    </span>
                  </div>
                  <Progress value={getProgress(status.childGenerated, status.total)} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Teen Images (5-8 grade)</span>
                    <span className="text-sm text-muted-foreground">
                      {status.teenGenerated} / {status.total}
                    </span>
                  </div>
                  <Progress value={getProgress(status.teenGenerated, status.total)} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Adult Images (9+ grade)</span>
                    <span className="text-sm text-muted-foreground">
                      {status.adultGenerated} / {status.total}
                    </span>
                  </div>
                  <Progress value={getProgress(status.adultGenerated, status.total)} />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Click "Refresh" to load status</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}