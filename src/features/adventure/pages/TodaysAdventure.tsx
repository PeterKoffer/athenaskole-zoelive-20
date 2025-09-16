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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to today's adventure, {user?.user_metadata?.first_name || 'Student'}! 🌟
          </h1>
          <p className="text-xl text-cyan-200 mb-6">
            Your personalized learning adventure awaits
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                  🎓
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">Today's Adventure</h3>
                  <p className="text-cyan-200 text-sm">Explore, learn and grow with us</p>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                Each day brings a new exciting learning adventure specially designed for you. 
                Click the button below to discover what awaits you today!
              </p>
            </div>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Your Adventure</CardTitle>
                <p className="text-cyan-200">Ready to begin your learning journey?</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearCache}
                title="Clear cache to get a different adventure"
                className="border-white/30 text-white hover:bg-white/20"
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
                className="w-full max-w-md mx-auto bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
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
                <Badge variant="outline" className="mt-3 border-white/30 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {generationTime}ms
                </Badge>
              )}
            </div>

            {error && (
              <div className="p-4 border border-red-400/50 bg-red-900/20 rounded-md">
                <p className="text-red-200 text-sm font-medium">❌ Error:</p>
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}
            
            {!error && !data && !loading && (
              <div className="p-4 border border-white/20 bg-white/5 rounded-md text-center">
                <p className="text-white/90 text-sm">
                  Ready to start your learning adventure? Click "Discover Today's Adventure" to begin.
                </p>
                <p className="text-xs text-white/70 mt-2">
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