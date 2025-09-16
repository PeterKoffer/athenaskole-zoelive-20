import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Compass, RefreshCw } from "lucide-react";
import { AdventureService } from "@/services/adventure/service";
import AdventureDisplay from "../components/AdventureDisplay";
import { useAuth } from "@/hooks/useAuth";
import type { AdventureUniverse } from "@/services/adventure/service";

export default function TodaysAdventure() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);

  async function loadTodaysAdventure() {
    if (!user?.id) {
      setError("Please log in to access your adventures");
      return;
    }

    setLoading(true); 
    setError(null);
    setGenerationTime(null);
    const startTime = Date.now();
    
    try {
      const result = await AdventureService.getTodaysAdventure({
        userId: user.id,
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

  const handleStartAdventure = async (universe: AdventureUniverse, isRecap: boolean) => {
    if (!user?.id) return;
    
    console.log('🚀 Starting adventure:', universe.title, isRecap ? '(Recap)' : '(New)');
    
    // TODO: Navigate to adventure experience
    // navigate(`/adventure/${universe.id}`, { 
    //   state: { 
    //     universe, 
    //     isRecap,
    //     startTime: new Date().toISOString()
    //   } 
    // });
    
    // For now, just mark as started (you might want to do this when actually completed)
    // await AdventureService.completeAdventure(user.id, universe.id, isRecap);
  };

  const clearCache = () => {
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
                <CardTitle>Today's Adventure</CardTitle>
                <p className="text-muted-foreground">Your daily learning adventure awaits!</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearCache}
                title="Clear cache to get a different adventure"
              >
                Clear Cache
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Button 
                onClick={loadTodaysAdventure} 
                disabled={loading} 
                size="lg"
                className="w-full max-w-md mx-auto"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Discovering Your Adventure...
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4 mr-2" />
                    Discover Today's Adventure
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
                  Ready to start your learning adventure? Click "Discover Today's Adventure" to begin.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Each adventure is unique and never repeats - unless it's time for a recap!
                </p>
              </div>
            )}
            
            {data && (
              <AdventureDisplay 
                universe={data.universe}
                content={data.content}
                isRecap={data.isRecap}
                onStartAdventure={handleStartAdventure}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}