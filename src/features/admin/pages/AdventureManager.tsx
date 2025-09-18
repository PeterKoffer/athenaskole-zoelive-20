import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Image, RefreshCw, AlertCircle, Archive, Sparkles } from 'lucide-react';
import { AdventureImageService } from '@/services/AdventureImageService';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

export default function AdventureManager() {
  const [importing, setImporting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [archiveResult, setArchiveResult] = useState<any>(null);
  const [regenerationResult, setRegenerationResult] = useState<any>(null);
  const [status, setStatus] = useState<{
    total: number;
    childGenerated: number;
    teenGenerated: number;
    adultGenerated: number;
  } | null>(null);
  const [bankImages, setBankImages] = useState<any[]>([]);

  const handleImportAdventures = async (filename: string) => {
    setImporting(true);
    try {
      const response = await fetch(`/src/data/${filename}`);
      const data = await response.json();
      
      // Transform format to expected format
      const transformedData = data.map((adventure: any) => ({
        universeId: adventure.id,
        gradeInt: adventure.gradeInt,
        title: adventure.title,
        prompt: adventure.image_prompt,
        description: adventure.pitch,
        subject: adventure.subject
      }));
      
      const result = await AdventureImageService.importAdventures(transformedData);
      
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
        batchSize: 50, // Process 50 adventures at once instead of 3
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

  const loadPictureBank = async () => {
    try {
      const { data, error } = await supabase
        .from('image_assets')
        .select('*')
        .contains('tags', ['adventure-cover'])
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (error) throw error;
      setBankImages(data || []);
      toast.success(`Loaded ${data?.length || 0} images from picture bank`);
    } catch (error) {
      console.error('Failed to load picture bank:', error);
      toast.error('Failed to load picture bank');
    }
  };

  const handleArchiveOldImages = async () => {
    try {
      setIsArchiving(true);
      const result = await AdventureImageService.archiveOldImages();
      setArchiveResult(result);
      toast.success(`${result.archivedImages} images moved to archive folder`);
    } catch (error: any) {
      toast.error(`Archive failed: ${error.message}`);
    } finally {
      setIsArchiving(false);
    }
  };

  const handleRegenerateAll = async () => {
    try {
      setIsRegenerating(true);
      const result = await AdventureImageService.regenerateAllImages({
        batchSize: 5, // Smaller batches to avoid rate limits
        ageGroups: ['child', 'teen', 'adult'],
        forceRegenerate: false // Don't re-archive if already done
      });
      setRegenerationResult(result);
      toast.success(`Generated ${result.successful} new cinematic images`);
    } catch (error: any) {
      toast.error(`Regeneration failed: ${error.message}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleFullMigration = async () => {
    try {
      setIsArchiving(true);
      setIsRegenerating(true);
      
      // Archive old images first
      const archiveResult = await AdventureImageService.archiveOldImages();
      setArchiveResult(archiveResult);
      
      setIsArchiving(false);
      
      // Then regenerate everything
      const regenResult = await AdventureImageService.regenerateAllImages({
        batchSize: 5,
        ageGroups: ['child', 'teen', 'adult'],
        forceRegenerate: false
      });
      setRegenerationResult(regenResult);
      
      toast.success(`Migration Complete! Archived ${archiveResult.archivedImages} old images and generated ${regenResult.successful} new cinematic ones`);
    } catch (error: any) {
      toast.error(`Migration failed: ${error.message}`);
    } finally {
      setIsArchiving(false);
      setIsRegenerating(false);
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

      {/* Image Migration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Adventure Image Migration
          </CardTitle>
          <CardDescription>
            Migrate from generic classroom images to cinematic, adventure-specific visuals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Migration Process:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Archive existing generic classroom images</li>
                  <li>Reset adventure image generation flags</li>
                  <li>Generate new cinematic, adventure-specific images</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleArchiveOldImages}
              disabled={isArchiving || isRegenerating}
              variant="outline"
              className="h-20 flex flex-col gap-1"
            >
              <Archive className="w-5 h-5" />
              {isArchiving ? "Archiving..." : "Archive Old Images"}
            </Button>

            <Button
              onClick={handleRegenerateAll}
              disabled={isArchiving || isRegenerating}
              variant="outline"
              className="h-20 flex flex-col gap-1"
            >
              <RefreshCw className="w-5 h-5" />
              {isRegenerating ? "Generating..." : "Generate New Images"}
            </Button>

            <Button
              onClick={handleFullMigration}
              disabled={isArchiving || isRegenerating}
              className="h-20 flex flex-col gap-1"
            >
              <Sparkles className="w-5 h-5" />
              {isArchiving || isRegenerating ? "Migrating..." : "Full Migration"}
            </Button>
          </div>

          {archiveResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Archive Complete</h4>
              <p className="text-sm text-green-700">
                {archiveResult.archivedImages} images moved to {archiveResult.archiveFolder}
              </p>
            </div>
          )}

          {regenerationResult && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Regeneration Complete</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>✅ Successful: {regenerationResult.successful} images</p>
                <p>❌ Failed: {regenerationResult.failed} images</p>
                <p>📊 Processed: {regenerationResult.processed} adventures</p>
                <p>🎯 Age Groups: {regenerationResult.ageGroups.join(', ')}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Import Adventures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Adventures
            </CardTitle>
            <CardDescription>
              Import adventures into the database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => handleImportAdventures('nelie_adventures_300_lang_geo_music_pe.json')}
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
                  Import 300 Language/Geography/Music/PE
                </>
              )}
            </Button>
            
            <Button 
              onClick={() => handleImportAdventures('nelie_adventures_200_from_user_mapped_12_subjects.json')}
              disabled={importing}
              className="w-full"
              variant="outline"
            >
              {importing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import 200 Mapped to 12 Subjects
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

        {/* Picture Bank */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Picture Bank
            </CardTitle>
            <CardDescription>
              View recently generated adventure images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={loadPictureBank}
              variant="outline"
              className="w-full mb-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Load Recent Images
            </Button>
            
            {bankImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {bankImages.map((img) => (
                  <div key={img.id} className="space-y-2">
                    <img 
                      src={img.url} 
                      alt={img.alt_text || 'Generated image'}
                      className="w-full aspect-video object-cover rounded border"
                    />
                    <div className="text-xs text-muted-foreground">
                      <div>{img.alt_text}</div>
                      <div className="flex gap-1 flex-wrap">
                        {img.tags?.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {bankImages.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No images found in picture bank
              </p>
            )}
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