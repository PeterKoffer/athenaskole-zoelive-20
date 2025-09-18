import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { AdventureService } from "@/services/adventure/service";
import AdventureDisplay from "../components/AdventureDisplay";
import { useAuth } from "@/hooks/useAuth";
import type { AdventureUniverse } from "@/services/adventure/service";
import adventureIllustration from "@/assets/adventure-illustration.jpg";
import digitalDetoxCover from "@/assets/digital-detox-cover.webp";
import UniverseImage from "@/components/UniverseImage";
import { supabase } from "@/integrations/supabase/client";
import AdventureLessonPlayer from "@/components/adventure/AdventureLessonPlayer";

export default function TodaysAdventure() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<any>(null);

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
        gradeLevel: "6-8", // Fixed to match expected format
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
    
    console.log('🚀 Starting adventure lesson generation:', universe.title, isRecap ? '(Recap)' : '(New)');
    
    try {
      setLoading(true);
      
      // Call our new edge function to generate the lesson
      const { data: lessonData, error } = await supabase.functions.invoke('generate-adventure-multipart', {
        body: {
          adventure: {
            id: universe.id,
            title: universe.title,
            subject: universe.subject,
            category: universe.category || 'General',
            gradeLevel: universe.grade_level,
            description: universe.description,
            tags: universe.metadata?.tags || [],
            crossSubjects: universe.metadata?.crossSubjects || []
          },
          studentProfile: {
            abilities: 'mixed ability with both support and challenges',
            learningStyle: 'multimodal approach',
            interests: ['technology', 'games', 'creativity']
          },
          schoolSettings: {
            curriculum: 'broadly accepted topics and skills for that grade',
            teachingPerspective: 'balanced, evidence-based style',
            lessonDuration: 135  // 2.25 hours when no teacher parameters set
          },
          teacherPreferences: {
            subjectWeights: {
              [universe.subject]: 'medium'
            }
          },
          calendarContext: {
            keywords: ['interactive learning', 'problem solving'],
            duration: 'single session'
          }
        }
      });
      
      if (error) {
        console.error('❌ Adventure lesson generation failed:', error);
        throw new Error(error.message || 'Failed to generate lesson');
      }
      
      if (lessonData?.success) {
        console.log('✅ Adventure lesson generated successfully!');
        console.log('📚 Lesson preview:', lessonData.lesson.title);
        console.log('🎯 Number of stages:', lessonData.lesson.stages?.length);
        
        // Set the lesson data to show the lesson player
        setLessonData(lessonData.lesson);
        
        // TODO: Save adventure completion when database table is ready
        // await AdventureService.completeAdventure(user.id, universe.id, isRecap);
      } else {
        throw new Error('Lesson generation failed');
      }
      
    } catch (error) {
      console.error('❌ Error starting adventure:', error);
      setError(error instanceof Error ? error.message : 'Failed to start adventure');
    } finally {
      setLoading(false);
    }
  };

  // Auto-load today's adventure when component mounts
  useEffect(() => {
    if (user?.id && !data && !loading) {
      loadTodaysAdventure();
    }
  }, [user?.id, data, loading]);

  const handleLessonBack = () => {
    setLessonData(null);
  };

  const handleLessonComplete = () => {
    setLessonData(null);
    // TODO: Save adventure completion when database table is ready
    // await AdventureService.completeAdventure(user.id, data?.universe?.id, false);
  };

  // Show lesson player if lesson data is available
  if (lessonData) {
    return (
      <AdventureLessonPlayer
        lessonData={lessonData}
        onBack={handleLessonBack}
        onComplete={handleLessonComplete}
      />
    );
  }

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
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <span className="ml-3 text-white">Loading your adventure...</span>
              </div>
            )}

            {!loading && !data && !error && (
              <div className="text-center py-12">
                <p className="text-white/90">Your adventure is being prepared...</p>
              </div>
            )}

            {data && (
              <div className="space-y-6">
                {/* Adventure Title */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {data.universe?.title || 'Learning Quest'}
                  </h2>
                  <div className="flex justify-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-cyan-400/20 text-cyan-300 rounded-full text-sm">
                      {data.universe?.subject || 'Learning'}
                    </span>
                    <span className="px-3 py-1 bg-purple-400/20 text-purple-300 rounded-full text-sm">
                      Grade {data.universe?.grade_level || '6-8'}
                    </span>
                    {data.isRecap && (
                      <span className="px-3 py-1 bg-orange-400/20 text-orange-300 rounded-full text-sm">
                        🔄 Recap
                      </span>
                    )}
                  </div>
                </div>

                {/* Adventure Image - Full size for perfect framing */}
                <div className="rounded-xl overflow-hidden">
                  {data.universe?.metadata?.gradeInt ? (
                    <UniverseImage
                      universeId={data.universe.id}
                      gradeInt={data.universe.metadata.gradeInt}
                      title={data.universe.title}
                      className="w-full aspect-video object-cover"
                      alt={`Learning Adventure: ${data.universe.title}`}
                      width={1024}
                      height={576}
                    />
                  ) : (
                    <img 
                      src={data.universe?.title?.includes('Digital Detox') ? digitalDetoxCover : adventureIllustration} 
                      alt={`Learning Adventure: ${data.universe?.title || 'Adventure'}`}
                      className="w-full aspect-video object-cover"
                    />
                  )}
                </div>



                {/* Start Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={() => handleStartAdventure(data.universe, data.isRecap)}
                    size="lg"
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-white font-semibold py-4 px-12 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Play className="w-5 h-5 mr-3" />
                    {data.isRecap ? 'Continue Adventure' : 'Start Adventure'}
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 border border-red-400/50 bg-red-900/20 rounded-md">
                <p className="text-red-200 text-sm font-medium">❌ Error:</p>
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}