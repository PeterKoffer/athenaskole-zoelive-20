import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, RefreshCw } from "lucide-react";
import { DailyUniverseService } from "@/services/universe/dailyUniverseService";
import DailyUniverseDisplay from "../components/DailyUniverseDisplay";
import { useAuth } from "@/hooks/useAuth";
import type { Universe } from "@/services/universe/dailyUniverseService";

// Removed contentClient dependency - now using DailyUniverseService directly

export default function UniverseLesson() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);

  async function loadTodaysProgram() {
    setLoading(true); 
    setError(null);
    setGenerationTime(null);
    const startTime = Date.now();
    
    try {
      // Load today's universe from your collection of 326+ universes
      const result = await DailyUniverseService.getTodaysUniverse({
        userId: user?.id,
        gradeLevel: "6-12", // TODO: Get from user profile
        preferences: {
          curriculum: "DK",
          difficulty: "average",
          learningStyle: "visual",
          interests: ["technology", "games"],
        }
      });
      
      setData(result);
      setGenerationTime(Date.now() - startTime);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setData(null);
      setGenerationTime(Date.now() - startTime);
    } finally {
      setLoading(false);
    }
  }

  const handleStartJourney = (universe: Universe) => {
    // TODO: Navigate to scenario runner or start the universe experience
    console.log('🚀 Starting learning journey with universe:', universe);
    // navigate(`/scenario/${universe.id}`, { state: { universe } });
  };

  const clearCache = () => {
    // Clear the data to force a fresh universe selection
    setData(null);
    console.log('🧹 Cache cleared - next selection will be fresh');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daily Program — Your Learning Universe</CardTitle>
                <p className="text-muted-foreground">Complete school day experience across all subjects</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearCache}
                title="Clear cache to force fresh generation"
              >
                Clear Cache
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Button 
                onClick={loadTodaysProgram} 
                disabled={loading} 
                size="lg"
                className="w-full max-w-md mx-auto"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading Today's Learning Universe...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    View Daily Program
                  </>
                )}
              </Button>
              
              {generationTime && (
                <Badge variant="outline" className="mt-3">
                  <Clock className="w-3 h-3 mr-1" />
                  {generationTime}ms
                </Badge>
              )}
            </div>

            {error && (
              <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-md">
                <p className="text-destructive text-sm font-medium">❌ Error:</p>
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
            
            {!error && !data && !loading && (
              <div className="p-4 border border-muted rounded-md text-center">
                <p className="text-muted-foreground text-sm">
                  Ready to start your learning journey? Click "View Daily Program" to discover today's universe.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Each day brings a new learning adventure from our collection of 326+ universes
                </p>
              </div>
            )}
            
            
            {data && (
              <DailyUniverseDisplay 
                universe={data.universe}
                content={data.content}
                onStartJourney={handleStartJourney}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}