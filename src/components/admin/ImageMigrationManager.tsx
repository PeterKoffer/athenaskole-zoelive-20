import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Archive, Sparkles, RefreshCw } from "lucide-react";
import { AdventureImageService } from "@/services/AdventureImageService";
import { useToast } from "@/hooks/use-toast";

export function ImageMigrationManager() {
  const [isArchiving, setIsArchiving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [archiveResult, setArchiveResult] = useState<any>(null);
  const [regenerationResult, setRegenerationResult] = useState<any>(null);
  const { toast } = useToast();

  const handleArchiveOldImages = async () => {
    try {
      setIsArchiving(true);
      const result = await AdventureImageService.archiveOldImages();
      setArchiveResult(result);
      toast({
        title: "Images Archived Successfully",
        description: `${result.archivedImages} images moved to archive folder`,
      });
    } catch (error: any) {
      toast({
        title: "Archive Failed",
        description: error.message,
        variant: "destructive",
      });
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
      toast({
        title: "Regeneration Complete",
        description: `Generated ${result.successful} new cinematic images`,
      });
    } catch (error: any) {
      toast({
        title: "Regeneration Failed", 
        description: error.message,
        variant: "destructive",
      });
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
      
      toast({
        title: "Migration Complete!",
        description: `Archived ${archiveResult.archivedImages} old images and generated ${regenResult.successful} new cinematic ones`,
      });
    } catch (error: any) {
      toast({
        title: "Migration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsArchiving(false);
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
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
    </div>
  );
}