import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { AdventureService } from "@/services/adventure/service";
import AdventureDisplay from "../components/AdventureDisplay";
import { useAuth } from "@/hooks/useAuth";
import type { AdventureUniverse } from "@/services/adventure/service";
import adventureIllustration from "@/assets/adventure-illustration.jpg";

export default function TodaysAdventure() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadTodaysAdventure() {
    if (!user?.id) {
      setError("Please log in to access your adventures");
      return;
    }

    setLoading(true); 
    setError(null);
    
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
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setData(null);
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

  // Auto-load today's adventure when component mounts
  useEffect(() => {
    if (user?.id && !data && !loading) {
      loadTodaysAdventure();
    }
  }, [user?.id, data, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to today's adventure, {user?.user_metadata?.first_name || 'Student'}! 🌟
          </h1>
          <p className="text-xl text-cyan-200">
            Your personalized learning adventure awaits
          </p>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <div>
              <CardTitle className="text-white">Your Adventure</CardTitle>
              <p className="text-cyan-200">Ready to begin your learning journey?</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Adventure Illustration and Description */}
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden">
                <img 
                  src={adventureIllustration} 
                  alt="Today's Learning Adventure" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">Today's Adventure: Mathematical Mysteries</h3>
                  <p className="text-white/90 text-sm">
                    Join us on an exciting journey through the world of numbers and patterns!
                  </p>
                </div>
              </div>

              <div className="bg-black/20 rounded-lg p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-3">What Awaits You Today</h4>
                <div className="space-y-3 text-white/90">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Explore fascinating mathematical patterns in nature</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Solve interactive puzzles and brain teasers</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Discover how math connects to real-world applications</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Adventure
              </Button>
            </div>

            {error && (
              <div className="p-4 border border-red-400/50 bg-red-900/20 rounded-md">
                <p className="text-red-200 text-sm font-medium">❌ Error:</p>
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}
            
            {data && (
              <div className="mt-6">
                <AdventureDisplay 
                  universe={data.universe}
                  content={data.content}
                  isRecap={data.isRecap}
                  onStartAdventure={handleStartAdventure}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}