import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Play, Loader2, Users, Map, Target } from 'lucide-react';
import { Universe, UniverseGenerator } from '@/services/UniverseGenerator';
import { AdaptiveUniverseGenerator } from '@/services/AdaptiveUniverseGenerator';
import { dailyLessonGenerator } from '@/services/dailyLessonGenerator';
import { LessonActivity } from '@/components/education/components/types/LessonTypes';
import TextWithSpeaker from '@/components/education/components/shared/TextWithSpeaker';
import { UniverseImageGenerator } from '@/services/UniverseImageGenerator';
import { emitInterest } from '@/services/interestSignals';
import { topTags } from '@/services/interestProfile';

const DailyProgramPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [loadingUniverse, setLoadingUniverse] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonActivities, setLessonActivities] = useState<LessonActivity[] | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const universeRef = useRef<HTMLDivElement | null>(null);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your daily program...</p>
        </div>
      </div>
    );
  }

  const generateUniverse = async () => {
    setLoadingUniverse(true);
    setError(null);

    try {
      // Emit interest signal for generating universe
      emitInterest('general', 1, 'universe_generation');
      
      // Use adaptive generation based on user interests
      const grade = (user?.user_metadata as any)?.grade_level || 6;
      let result = await AdaptiveUniverseGenerator.generatePersonalizedUniverse('general', grade);
      
      if (!result) {
        // Fallback to a built-in sample if generation fails completely
        result = UniverseGenerator.getUniverses()[0];
      }

      // Generate AI image for the universe
      if (result) {
        setGeneratingImage(true);
        try {
          const generatedImageUrl = await UniverseImageGenerator.generateImage({
            title: result.title || 'Learning Universe',
            description: result.description,
            theme: result.theme || 'education'
          });
          
          if (generatedImageUrl) {
            result.image = generatedImageUrl;
            console.log('✅ Universe image generated:', generatedImageUrl);
          }
        } catch (imgError) {
          console.warn('⚠️ Image generation failed, using placeholder:', imgError);
        } finally {
          setGeneratingImage(false);
        }
      }

      setUniverse(result);

      // Generate today's lesson activities based on the universe theme
      if (result) {
        await generateLessonFromUniverse(result as Universe);
      }

      // After setting the universe scroll to the details section
      setTimeout(() => {
        universeRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate universe');
      // Show a sample universe so the user still sees content
      setUniverse(UniverseGenerator.getUniverses()[0]);
    } finally {
      setLoadingUniverse(false);
    }
  };

  const generateLessonFromUniverse = async (u: Universe) => {
    if (!user) return;

    setLoadingLesson(true);
    setLessonError(null);

    try {
      const grade = 6;
      const currentDate = new Date().toISOString().split('T')[0];
      const activities = await dailyLessonGenerator.generateDailyLesson({
        subject: u.theme || 'general',
        skillArea: 'general',
        userId: user.id,
        gradeLevel: grade,
        currentDate
      });

      setLessonActivities(activities);
    } catch (err) {
      setLessonError(err instanceof Error ? err.message : 'Failed to generate lesson');
    } finally {
      setLoadingLesson(false);
    }
  };

  const handleStartLearning = () => {
    if (universe) {
      const grade = (user?.user_metadata as any)?.grade_level || 6;
      navigate('/daily-universe-lesson', { state: { universe, gradeLevel: grade } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:text-blue-300 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Today's Program
            </h1>
            <TextWithSpeaker
              text="Welcome back! Here's your personalized AI-generated learning universe for today."
              context="daily-program-header"
              position="corner"
            >
              <p className="text-blue-200">Welcome back! Here's your personalized AI-generated learning universe for today.</p>
            </TextWithSpeaker>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-400 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-primary" />
                Your AI-Generated Learning Universe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TextWithSpeaker
                text={`Today's learning adventure is uniquely crafted based on your interests: ${topTags(3).join(', ') || 'discovering new topics'}! Dive into an immersive, AI-generated educational universe that adapts to what you love learning about.`}
                context="daily-program-intro"
              >
                <p className="text-lg text-blue-200 mb-6">
                  {`Today's learning adventure is uniquely crafted based on your interests: ${topTags(3).join(', ') || 'discovering new topics'}! Dive into an immersive, AI-generated educational universe that adapts to what you love learning about.`}
                </p>
              </TextWithSpeaker>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <TextWithSpeaker
                  text="Personalized Content. AI-crafted lessons that adapt to your progress and interests."
                  context="daily-program-feature-personalized"
                  className="group"
                >
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-lg border-2 border-white/20 relative text-white shadow-sm">
                    <h4 className="font-semibold text-white mb-2">Personalized Content</h4>
                    <p className="text-sm text-white/90">
                      AI-crafted lessons that adapt to your progress and interests
                    </p>
                  </div>
                </TextWithSpeaker>
                <TextWithSpeaker
                  text="Interactive Universe. Explore characters, locations, and activities in your learning world."
                  context="daily-program-feature-interactive"
                  className="group"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-lg border-2 border-white/20 relative text-white shadow-sm">
                    <h4 className="font-semibold text-white mb-2">Interactive Universe</h4>
                    <p className="text-sm text-white/90">
                      Explore characters, locations, and activities in your learning world
                    </p>
                  </div>
                </TextWithSpeaker>
                <TextWithSpeaker
                  text="Dynamic Learning. Content that evolves based on your performance and engagement."
                  context="daily-program-feature-dynamic"
                  className="group"
                >
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-lg border-2 border-white/20 relative text-white shadow-sm">
                    <h4 className="font-semibold text-white mb-2">Dynamic Learning</h4>
                    <p className="text-sm text-white/90">
                      Content that evolves based on your performance and engagement
                    </p>
                  </div>
                </TextWithSpeaker>
                <TextWithSpeaker
                  text="Gamified Experience. Learn through engaging activities and achievement systems."
                  context="daily-program-feature-gamified"
                  className="group"
                >
                  <div className="bg-gradient-to-br from-fuchsia-500 to-pink-600 p-4 rounded-lg border-2 border-white/20 relative text-white shadow-sm">
                    <h4 className="font-semibold text-white mb-2">Gamified Experience</h4>
                    <p className="text-sm text-white/90">
                      Learn through engaging activities and achievement systems
                    </p>
                  </div>
                </TextWithSpeaker>
              </div>
              {!universe && (
                <Button
                  onClick={() => {
                    emitInterest('adventure', 1, 'start_button');
                    generateUniverse();
                  }}
                  size="lg"
                  disabled={loadingUniverse || generatingImage}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loadingUniverse ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating Your Personalized Universe...
                    </>
                  ) : generatingImage ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating Visual...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" /> Start Your Personalized Adventure
                    </>
                  )}
                </Button>
              )}
          </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-400 text-white">
            <CardHeader>
              <CardTitle className="text-white">Need More Practice?</CardTitle>
            </CardHeader>
            <CardContent>
              <TextWithSpeaker
                text="Looking for specific subject practice? Visit the Training Ground for focused learning activities."
                context="daily-program-practice"
              >
                <p className="text-blue-200 mb-4">
                  Looking for specific subject practice? Visit the Training Ground for focused learning activities.
                </p>
              </TextWithSpeaker>
              <Button 
                variant="outline" 
                onClick={() => navigate('/training-ground')}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold backdrop-blur-sm border border-white/30 hover:border-white/50"
              >
                Go to Training Ground
              </Button>
          </CardContent>
          </Card>

          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="text-center text-destructive">
                  <p className="mb-4">❌ {error}</p>
                  <Button onClick={generateUniverse} variant="outline">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {universe && (
            <div className="space-y-6" ref={universeRef}>
              <Card className="bg-gradient-to-r from-blue-900 to-purple-900 overflow-hidden text-white">
                <div className="relative">
                  <img 
                    src={universe.image ?? "/placeholder.svg"} 
                    alt={`Learning universe: ${universe.title}`} 
                    className="w-full aspect-video object-cover bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" 
                  />
                  {generatingImage && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                        <span className="text-white text-sm">Generating universe image...</span>
                      </div>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{universe.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <TextWithSpeaker text={universe.description || ''} context="universe-description">
                    <p className="text-lg text-blue-200">{universe.description}</p>
                  </TextWithSpeaker>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-sky-600 to-blue-700 border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Users className="w-5 h-5 mr-2 text-white/90" /> Characters
                    </CardTitle>
                  </CardHeader>
                  <TextWithSpeaker
                    text={universe.characters?.length ? `Characters: ${universe.characters.join(', ')}` : 'No characters available'}
                    context="universe-characters"
                    className="block"
                  >
                    <CardContent>
                      <ul className="space-y-2">
                        {universe.characters?.length ? (
                          universe.characters.map((character, index) => (
                            <li key={index} className="text-sm text-white/90">• {character}</li>
                          ))
                        ) : (
                          <li className="text-sm text-white/90">No characters available</li>
                        )}
                      </ul>
                    </CardContent>
                  </TextWithSpeaker>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-600 to-green-700 border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Map className="w-5 h-5 mr-2 text-white/90" /> Locations
                    </CardTitle>
                  </CardHeader>
                  <TextWithSpeaker
                    text={universe.locations?.length ? `Locations: ${universe.locations.join(', ')}` : 'No locations available'}
                    context="universe-locations"
                    className="block"
                  >
                    <CardContent>
                      <ul className="space-y-2">
                        {universe.locations?.length ? (
                          universe.locations.map((location, index) => (
                            <li key={index} className="text-sm text-white/90">• {location}</li>
                          ))
                        ) : (
                          <li className="text-sm text-white/90">No locations available</li>
                        )}
                      </ul>
                    </CardContent>
                  </TextWithSpeaker>
                </Card>

                <Card className="bg-gradient-to-br from-fuchsia-600 to-pink-700 border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Target className="w-5 h-5 mr-2 text-white/90" /> Activities
                    </CardTitle>
                  </CardHeader>
                  <TextWithSpeaker
                    text={universe.activities?.length ? `Activities: ${universe.activities.join(', ')}` : 'No activities available'}
                    context="universe-activities"
                    className="block"
                  >
                    <CardContent>
                      <ul className="space-y-2">
                        {universe.activities?.length ? (
                          universe.activities.map((activity, index) => (
                            <li key={index} className="text-sm text-white/90">• {activity}</li>
                          ))
                        ) : (
                          <li className="text-sm text-white/90">No activities available</li>
                        )}
                      </ul>
                    </CardContent>
                  </TextWithSpeaker>
                </Card>
              </div>

            </div>
          )}

          {loadingLesson && (
            <Card>
              <CardContent className="py-6 text-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin inline-block" /> Generating lesson...
              </CardContent>
            </Card>
          )}

          {lessonError && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="text-center text-destructive">❌ {lessonError}</div>
              </CardContent>
            </Card>
          )}

          {lessonActivities && lessonActivities.length > 0 && (
            <div className="text-center">
              <Button
                onClick={handleStartLearning}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Play className="w-5 h-5 mr-2" /> Start Learning Session
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyProgramPage;
