import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, BookOpen, Play, Loader2 } from 'lucide-react';
import { aiUniverseGenerator } from '@/services/AIUniverseGenerator';
import { Universe, UniverseGenerator } from '@/services/UniverseGenerator';
import { dailyLessonGenerator } from '@/services/dailyLessonGenerator';
import { LessonActivity } from '@/components/education/components/types/LessonTypes';

const DailyProgramPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [loadingUniverse, setLoadingUniverse] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonActivities, setLessonActivities] = useState<LessonActivity[] | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const universeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Automatically generate a universe when the page first loads
    if (!universe && !loadingUniverse) {
      generateUniverse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
      const prompt =
        'Create an engaging daily learning universe for students with interactive activities, interesting characters, and educational adventures.';
      let result = await aiUniverseGenerator.generateUniverse(prompt);
      if (!result) {
        // Fallback to a built-in sample if generation fails completely
        result = UniverseGenerator.getUniverses()[0];
      }

      if (typeof result === 'string') {
        try {
          result = JSON.parse(result);
        } catch {
          result = UniverseGenerator.getUniverses()[0];
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
    if (!universe) return;

    const theme = universe.theme?.toLowerCase();
    const themeToPath: Record<string, string> = {
      mathematics: '/learn/mathematics',
      science: '/learn/science',
      history: '/learn/history-religion',
      languages: '/learn/language-lab',
      arts: '/learn/creative-arts',
      technology: '/learn/computer-science'
    };

    const path = (theme && themeToPath[theme]) || '/training-ground';
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-primary" />
              Today's Program
            </h1>
            <p className="text-muted-foreground">Welcome back! Here's your personalized AI-generated learning universe for today.</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-primary" />
                Your AI-Generated Learning Universe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                Today's learning adventure is uniquely crafted just for you! Dive into an immersive, 
                AI-generated educational universe filled with interactive content, engaging storylines, 
                and personalized challenges that adapt to your learning style.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">🎯 Personalized Content</h4>
                  <p className="text-sm text-muted-foreground">
                    AI-crafted lessons that adapt to your progress and interests
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">🌟 Interactive Universe</h4>
                  <p className="text-sm text-muted-foreground">
                    Explore characters, locations, and activities in your learning world
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">⚡ Dynamic Learning</h4>
                  <p className="text-sm text-muted-foreground">
                    Content that evolves based on your performance and engagement
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">🎮 Gamified Experience</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn through engaging activities and achievement systems
                  </p>
                </div>
              </div>
              
              <Button
                onClick={generateUniverse}
                size="lg"
                disabled={loadingUniverse}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loadingUniverse ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" /> Start Your Adventure
                  </>
                )}
              </Button>
          </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Need More Practice?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Looking for specific subject practice? Visit the Training Ground for focused learning activities.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/training-ground')}
                className="border-border text-foreground hover:bg-accent"
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
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardHeader>
                  <CardTitle className="text-2xl">{universe.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground">{universe.description}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">🎭 Characters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {universe.characters?.length ? (
                        universe.characters.map((character, index) => (
                          <li key={index} className="text-sm text-muted-foreground">• {character}</li>
                        ))
                      ) : (
                        <li className="text-sm text-muted-foreground">No characters available</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">🌍 Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {universe.locations?.length ? (
                        universe.locations.map((location, index) => (
                          <li key={index} className="text-sm text-muted-foreground">• {location}</li>
                        ))
                      ) : (
                        <li className="text-sm text-muted-foreground">No locations available</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">🎯 Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {universe.activities?.length ? (
                        universe.activities.map((activity, index) => (
                          <li key={index} className="text-sm text-muted-foreground">• {activity}</li>
                        ))
                      ) : (
                        <li className="text-sm text-muted-foreground">No activities available</li>
                      )}
                    </ul>
                  </CardContent>
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
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Today's Lesson Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {lessonActivities.map((act, idx) => (
                    <li key={act.id} className="text-sm text-muted-foreground">
                      {idx + 1}. {act.title}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={handleStartLearning}
                  size="lg"
                  className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Play className="w-5 h-5 mr-2" /> Start Learning Session
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyProgramPage;
