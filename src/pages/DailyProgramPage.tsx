import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Play, Loader2, Users, Map, Target, Plus, AlertCircle } from 'lucide-react';
import { Universe, UniverseGenerator } from '@/services/UniverseGenerator';
import { AdaptiveUniverseGenerator } from '@/services/AdaptiveUniverseGenerator';
import { dailyLessonGenerator } from '@/services/dailyLessonGenerator';
import { learnerGrade } from '@/lib/gradeLabels';
import { resolveLearnerGrade, gradeToBand } from '@/lib/grade';
import { getLearnerGrade } from '@/utils/grade';
import { UserMetadata } from '@/types/auth';
import TextWithSpeaker from '@/components/education/components/shared/TextWithSpeaker';
import { ensureDailyProgramCover } from '@/services/UniverseImageGenerator';
import UniverseImage from '@/components/UniverseImage';
import { emitInterest } from '@/services/interestSignals';
import { topTags } from '@/services/interestProfile';
import { Horizon } from '@/services/universe/state';
import { LessonSourceManager, LessonSource } from '@/services/lessonSourceManager';
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
  const [generatingImage, setGeneratingImage] = useState(false);
  const [horizon, setHorizon] = useState<Horizon>('day');
  const [currentSelectedSubject, setCurrentSelectedSubject] = useState<string>('');
  const universeRef = useRef<HTMLDivElement | null>(null);
  
  // New lesson source state
  const [lessonSource, setLessonSource] = useState<LessonSource | null>(null);
  const [loadingDailyLesson, setLoadingDailyLesson] = useState(false);

  // Don't render or load until we can resolve a grade
  const metadata = user?.user_metadata as UserMetadata | undefined;
  const learnerGradeValue = resolveLearnerGrade(metadata?.grade_level, metadata?.age);
  const learnerBandValue = gradeToBand(learnerGradeValue);
  // Use exact grade instead of band for UI display
  const lg = getLearnerGrade(metadata);

  // Guard: avoid kicking the loader with undefined grade
  const ready = Number.isFinite(learnerGradeValue);

  // Get lesson using priority system
  useEffect(() => {
    if (!user?.id || !ready) return;
    
    (async () => {
      setLoadingDailyLesson(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const userRole = (user?.user_metadata as any)?.role;
        
        const source = await LessonSourceManager.getLessonForDate(user.id, today, userRole, lg);
        setLessonSource(source);
      } catch (error) {
        console.error("Failed to get daily lesson:", error);
      } finally {
        setLoadingDailyLesson(false);
      }
    })();
  }, [user?.id, currentSelectedSubject, ready, learnerGradeValue, learnerBandValue]);

  const handleAddToCalendar = async () => {
    if (
      !user?.id ||
      !lessonSource ||
      (lessonSource.type !== 'ai-suggestion' && lessonSource.type !== 'universe-fallback')
    ) {
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const orgId = 'school-1'; // TODO: Get from user context
    const success = await LessonSourceManager.saveLessonToPlan(user.id, today, lessonSource.lesson, orgId);
    
    if (success) {
      // Refresh the lesson source to reflect the change
      const userRole = (user?.user_metadata as any)?.role;
      const source = await LessonSourceManager.getLessonForDate(user.id, today, userRole, lg);
      setLessonSource(source);
    }
  };


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
      emitInterest('adventure', 1, 'universe_generation');
      
      // Pick a random subject based on user interests or rotate through subjects
      const userInterests = topTags(3);
      const availableSubjects = ['mathematics', 'science', 'language arts', 'history', 'arts', 'geography'];
      
      const subjectMapping: Record<string, string> = {
        'mathematics': 'mathematics',
        'science': 'science', 
        'technology': 'science',
        'coding': 'computer science',
        'space': 'science',
        'nature': 'science',
        'animals': 'science',
        'health': 'science',
        'history': 'history',
        'geography': 'geography',
        'languages': 'language arts',
        'art': 'arts',
        'music': 'arts',
        'sports': 'physical education',
        'cooking': 'life skills',
        'adventure': 'language arts',
        'books': 'language arts',
        'reading': 'language arts'
      };
      
      let selectedSubject = '';
      
      // First try to map from user interests
      for (const interest of userInterests) {
        if (subjectMapping[interest]) {
          selectedSubject = subjectMapping[interest];
          break;
        }
      }
      
      // If no mapping found, pick a random subject to ensure variety
      if (!selectedSubject) {
        selectedSubject = availableSubjects[Math.floor(Math.random() * availableSubjects.length)];
      }
      
      setCurrentSelectedSubject(selectedSubject); // Store for display
      console.log('🎯 Selected subject:', selectedSubject, 'from interests:', userInterests);
      
      // Use adaptive generation based on user interests
      const grade = (user?.user_metadata as any)?.grade_level || 6;
      let result = await AdaptiveUniverseGenerator.generatePersonalizedUniverse(selectedSubject, grade, user?.id);
      
      if (!result) {
        // Fallback to a built-in sample if generation fails completely
        result = UniverseGenerator.getUniverses()[0];
      }

      if (result) {
        setGeneratingImage(true);
        try {
          const generatedImageUrl = await ensureDailyProgramCover({
            universeId: result.id,
            title: result.title || 'Learning Universe',
            subject: result.theme || 'education',
            grade,
          });

          if (generatedImageUrl) {
            result.image = generatedImageUrl;
            console.log('✅ Universe cover ensured:', generatedImageUrl);
          }
        } catch (imgError) {
          console.warn('⚠️ Cover generation failed, using placeholder:', imgError);
        } finally {
          setGeneratingImage(false);
        }
      }

      // Force refresh by adding timestamp to prevent caching
      const freshResult = {
        ...result,
        _timestamp: Date.now(),
        interests: userInterests || ['adventure'] // Ensure interests are always passed
      };
      
      setUniverse(freshResult);

      // Generate today's lesson activities based on the universe theme
      if (result) {
        await generateLessonFromUniverse(result as Universe);
      }

      // After setting the universe scroll to the details section (if supported)
      setTimeout(() => {
        const el = universeRef.current;
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth' });
        }
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
      const metadata = user?.user_metadata as UserMetadata | undefined;
      const grade = learnerGrade({ grade: metadata?.grade_level, age: metadata?.age });
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
    } else if (lessonSource) {
      // Navigate to lesson with the current lesson source
      const grade = (user?.user_metadata as any)?.grade_level || 6;
      navigate('/daily-universe-lesson', { state: { lesson: lessonSource.lesson, gradeLevel: grade } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:text-blue-300 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          {(user?.user_metadata as any)?.role === 'teacher' && (
            <Button
              onClick={() => navigate('/teacher-planning')}
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10"
            >
              Teacher Planning
            </Button>
          )}
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white">
              Today's Program
            </h1>
            {(import.meta.env.DEV || (user?.user_metadata as any)?.role === 'teacher') && (
              <select
                value={horizon} 
                onChange={e => setHorizon(e.target.value as Horizon)}
                className="text-[11px] border rounded px-2 py-1 bg-white/10 text-white border-white/30"
                title="Simulation horizon"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            )}
          </div>
            <TextWithSpeaker
              text="Welcome back! Here's your personalized AI-generated learning universe for today."
              context="daily-program-header"
              position="corner"
            >
              <p className="text-blue-200">Welcome back! Here's your personalized AI-generated learning universe for today.</p>
            </TextWithSpeaker>
        </div>

        {/* Daily Lesson Section with Source Priority */}
        {loadingDailyLesson ? (
          <div className="p-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading your daily lesson...</p>
          </div>
        ) : lessonSource ? (
          <div className="mb-8">
            {/* Source indicator and actions */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {lessonSource.type === 'planned' && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Teacher-Planned Lesson
                  </div>
                )}
                {lessonSource.type === 'universe-fallback' && (
                  <div className="flex items-center gap-2 text-blue-400 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    From Universe Catalog — add to plan if you like it
                  </div>
                )}
                {lessonSource.type === 'ai-suggestion' && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    AI Suggestion — not yet in your official plan
                  </div>
                )}
                {import.meta.env.DEV && (
                  <div className="text-xs opacity-70 ml-4">
                    Source: <span className="font-mono">{lessonSource.type}</span>
                    {lessonSource.lesson.__packId && <> • pack <span className="font-mono">{lessonSource.lesson.__packId}</span></>}
                  </div>
                )}
              </div>
              
              {(lessonSource.type === 'universe-fallback' || lessonSource.type === 'ai-suggestion') && (user?.user_metadata as any)?.role === 'teacher' && (
                <Button 
                  onClick={handleAddToCalendar}
                  size="sm" 
                  variant="outline"
                  className="text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
              )}
            </div>

            {/* Hero card */}
            <div className={`rounded-2xl overflow-hidden border border-neutral-800 ${
              lessonSource.type === 'planned' 
                ? 'bg-gradient-to-br from-green-700 to-emerald-600' 
                : 'bg-gradient-to-br from-indigo-700 to-blue-600'
            }`}>
              <div className="aspect-video bg-neutral-900/40 flex items-center justify-center relative overflow-hidden">
                {lessonSource.lesson.hero?.universeId ? (
                  <UniverseImage 
                    universeId={lessonSource.lesson.hero.universeId}
                    title={lessonSource.lesson.hero.title || 'Learning Universe'}
                    subject={lessonSource.lesson.hero.subject}
                    className="w-full h-full object-cover"
                  />
                ) : lessonSource.imageUrl ? (
                  <img src={lessonSource.imageUrl} alt={lessonSource.lesson.hero?.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-neutral-400 text-sm">Generating image...</div>
                )}
              </div>
              <div className="p-4 md:p-6 text-white">
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <span className="px-2 py-0.5 rounded-full bg-white/15">{lessonSource.lesson.hero?.subject}</span>
                  <span>•</span>
                  <span>Grade {lg}</span>
                  <span>•</span>
                  <span>{lessonSource.lesson.hero?.minutes} min</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold mt-2">{lessonSource.lesson.hero?.title}</h1>
                <p className="mt-1 opacity-95">{lessonSource.lesson.hero?.subtitle}</p>
              </div>
            </div>

            {/* Activities preview */}
            <div className="mt-6 space-y-4">
              {lessonSource.lesson.activities?.map((activity: any, index: number) => (
                <Card key={activity.id || index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-white">
                      <div className="text-xs opacity-70 mb-1">
                        {activity.kind} • ~{activity.estimatedMinutes ?? activity.minutes ?? 10} min
                        {activity.tags && <span className="ml-2">• {activity.tags.join(', ')}</span>}
                      </div>
                      <h3 className="font-semibold mb-2">{activity.title}</h3>
                      {activity.stem && <p className="text-gray-300 mb-2">{activity.stem}</p>}
                      {activity.instructions && <p className="text-gray-300 mb-2">{activity.instructions}</p>}
                      {activity.body && <p className="text-gray-300 mb-2">{activity.body}</p>}
                      {activity.prompt && <p className="text-gray-300 mb-2 italic">"{activity.prompt}"</p>}
                      {activity.options && (
                        <div className="text-gray-400 text-sm mt-2">
                          Multiple choice: {activity.options.length} options
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}

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
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary-foreground border border-primary/30">
                      {(currentSelectedSubject || universe.theme || 'General').charAt(0).toUpperCase() + (currentSelectedSubject || universe.theme || 'General').slice(1)}
                    </span>
                    <span className="text-sm text-white/60">•</span>
                    <span className="text-sm text-white/80">Grade {(user?.user_metadata as any)?.grade_level || 6}</span>
                    <span className="text-sm text-white/60">•</span>
                    <span className="text-sm text-white/80">150 min</span>
                  </div>
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
