import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, Gamepad2, Target, Brain, Calendar, Play, Pause, RotateCcw, Plus } from 'lucide-react';
import { DailyLessonOrchestrator, DailyLessonPlan, DailyActivity } from '@/services/dailyLessonOrchestrator';
import { AdaptiveDifficultyEngine, StudentPerformanceMetrics } from '@/services/adaptiveDifficultyEngine';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import EducationalGameEngine from '@/components/activities/EducationalGameEngine';
import EnhancedNelieInterface from '@/components/nelie/EnhancedNelieInterface';

interface EnhancedDailyProgramProps {
  studentId?: string;
  gradeLevel?: number;
}

const EnhancedDailyProgram = ({ 
  studentId = 'demo-student', 
  gradeLevel = 5 
}: EnhancedDailyProgramProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dailyPlan, setDailyPlan] = useState<DailyLessonPlan | null>(null);
  const [currentActivity, setCurrentActivity] = useState<DailyActivity | null>(null);
  const [activityIndex, setActivityIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const TARGET_LESSON_TIME = 20 * 60; // 20 minutes in seconds
  
  const [studentMetrics, setStudentMetrics] = useState<StudentPerformanceMetrics>({
    accuracy_rate: 75,
    response_time_avg: 30,
    consistency_score: 70,
    engagement_level: 85,
    recent_session_scores: [70, 75, 80, 85],
    mistake_patterns: [],
    strength_areas: ['basic_arithmetic', 'problem_solving'],
    challenge_areas: ['fractions', 'word_problems']
  });

  // Timer effect to track lesson progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && sessionStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, sessionStartTime]);

  useEffect(() => {
    initializeDailyProgram();
  }, [studentId, gradeLevel]);

  const initializeDailyProgram = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Initializing 20-minute Daily Program for Grade', gradeLevel);
      
      // Generate initial lesson plan targeting 20 minutes
      const lessonPlan = await DailyLessonOrchestrator.generateDailyLesson(
        studentId, 
        gradeLevel, 
        'mathematics'
      );
      
      // Adjust activities to fit 20-minute target
      const adjustedPlan = adjustLessonForTargetTime(lessonPlan, TARGET_LESSON_TIME);
      
      setDailyPlan(adjustedPlan);
      setCurrentActivity(adjustedPlan.activity_sequence[0]);
      
      toast({
        title: "20-Minute Daily Program Ready! 📚",
        description: `Generated ${adjustedPlan.activity_sequence.length} activities targeting 20 minutes`,
      });
      
      console.log('✅ 20-minute daily program initialized:', adjustedPlan);
    } catch (error) {
      console.error('❌ Error initializing daily program:', error);
      toast({
        title: "Setup Error",
        description: "Failed to generate daily program. Using fallback activities.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const adjustLessonForTargetTime = (plan: DailyLessonPlan, targetSeconds: number): DailyLessonPlan => {
    const targetMinutes = Math.floor(targetSeconds / 60);
    const currentTotalMinutes = plan.activity_sequence.reduce((sum, activity) => sum + activity.duration_minutes, 0);
    
    if (currentTotalMinutes < targetMinutes) {
      // Need to add more activities
      console.log(`📈 Lesson too short (${currentTotalMinutes}min), targeting ${targetMinutes}min`);
    } else if (currentTotalMinutes > targetMinutes) {
      // Need to trim activities
      console.log(`📉 Lesson too long (${currentTotalMinutes}min), targeting ${targetMinutes}min`);
      const adjustedActivities = trimActivitiesToTime(plan.activity_sequence, targetMinutes);
      plan.activity_sequence = adjustedActivities;
    }
    
    plan.total_duration_minutes = targetMinutes;
    return plan;
  };

  const trimActivitiesToTime = (activities: DailyActivity[], targetMinutes: number): DailyActivity[] => {
    let totalTime = 0;
    const trimmedActivities: DailyActivity[] = [];
    
    for (const activity of activities) {
      if (totalTime + activity.duration_minutes <= targetMinutes) {
        trimmedActivities.push(activity);
        totalTime += activity.duration_minutes;
      } else {
        // Adjust the last activity to fit exactly
        const remainingTime = targetMinutes - totalTime;
        if (remainingTime > 2) { // Only include if at least 2 minutes remain
          const adjustedActivity = { ...activity, duration_minutes: remainingTime };
          trimmedActivities.push(adjustedActivity);
        }
        break;
      }
    }
    
    return trimmedActivities;
  };

  const generateAdditionalContent = async () => {
    if (!dailyPlan || isGeneratingMore) return;
    
    setIsGeneratingMore(true);
    
    try {
      console.log('🔄 Student progressing faster - generating additional content');
      
      // Generate 2-3 more activities
      const additionalActivities = await generateMoreActivities(dailyPlan, 3);
      
      const updatedPlan = {
        ...dailyPlan,
        activity_sequence: [...dailyPlan.activity_sequence, ...additionalActivities],
        total_duration_minutes: dailyPlan.total_duration_minutes + additionalActivities.reduce((sum, a) => sum + a.duration_minutes, 0)
      };
      
      setDailyPlan(updatedPlan);
      
      toast({
        title: "More Content Generated! 🚀",
        description: `Added ${additionalActivities.length} more activities for continued learning`,
      });
      
    } catch (error) {
      console.error('❌ Error generating additional content:', error);
      toast({
        title: "Generation Error",
        description: "Failed to generate additional content",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const generateMoreActivities = async (basePlan: DailyLessonPlan, count: number): Promise<DailyActivity[]> => {
    const newActivities: DailyActivity[] = [];
    
    for (let i = 0; i < count; i++) {
      const activityType = i % 2 === 0 ? 'practice' : 'game';
      const difficulty = Math.min(5, studentMetrics.accuracy_rate > 80 ? 3 : 2);
      
      const newActivity: DailyActivity = {
        id: `additional-${Date.now()}-${i}`,
        type: activityType,
        title: `${activityType === 'practice' ? 'Extra Practice' : 'Bonus Game'}: ${basePlan.learning_units[0]?.title}`,
        duration_minutes: 5,
        curriculum_unit_id: basePlan.learning_units[0]?.id || 'general',
        difficulty_level: difficulty,
        activity_data: {
          content_type: activityType === 'practice' ? 'ai_question' : 'educational_game',
          parameters: {
            question_count: activityType === 'practice' ? 3 : undefined,
            game_type: activityType === 'game' ? 'challenge_mode' : undefined,
            adaptive_difficulty: true
          }
        },
        nelie_guidance: {
          introduction_prompt: `Great progress! Let's keep the momentum going with this ${activityType}!`,
          help_prompts: [
            "You're doing amazing!",
            "Let's tackle this together!",
            "Remember what we learned earlier!"
          ],
          encouragement_messages: [
            "Fantastic work!",
            "You're really mastering this!",
            "Keep up the excellent progress!"
          ]
        }
      };
      
      newActivities.push(newActivity);
    }
    
    return newActivities;
  };

  const startActivity = () => {
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
    setIsPlaying(true);
    setIsPaused(false);
    
    toast({
      title: "20-Minute Lesson Started! 🎯",
      description: currentActivity?.title || "Let's begin learning!",
    });
  };

  const pauseActivity = () => {
    setIsPaused(true);
    setIsPlaying(false);
    
    toast({
      title: "Lesson Paused ⏸️",
      description: "Take your time. Resume when ready!",
    });
  };

  const nextActivity = () => {
    if (!dailyPlan) return;
    
    const nextIndex = Math.min(activityIndex + 1, dailyPlan.activity_sequence.length - 1);
    setActivityIndex(nextIndex);
    setCurrentActivity(dailyPlan.activity_sequence[nextIndex]);
    setSessionProgress(((nextIndex + 1) / dailyPlan.activity_sequence.length) * 100);
    
    // Check if we need to generate more content for fast learners
    const remainingTime = TARGET_LESSON_TIME - elapsedTime;
    const remainingActivities = dailyPlan.activity_sequence.length - nextIndex - 1;
    
    if (remainingTime > 300 && remainingActivities <= 2) { // More than 5 minutes left with few activities
      generateAdditionalContent();
    }
  };

  const resetProgram = () => {
    setActivityIndex(0);
    setCurrentActivity(dailyPlan?.activity_sequence[0] || null);
    setSessionProgress(0);
    setIsPlaying(false);
    setIsPaused(false);
    setSessionStartTime(null);
    setElapsedTime(0);
    
    toast({
      title: "Program Reset 🔄",
      description: "Starting fresh with today's 20-minute lesson!",
    });
  };

  const handleActivityComplete = (score: number, achievements: string[]) => {
    const newMetrics = {
      ...studentMetrics,
      recent_session_scores: [...studentMetrics.recent_session_scores.slice(-3), score],
      accuracy_rate: (studentMetrics.accuracy_rate + score) / 2,
      engagement_level: Math.min(100, studentMetrics.engagement_level + (achievements.length * 5))
    };
    
    setStudentMetrics(newMetrics);
    
    toast({
      title: "Great Work! 🎉",
      description: `You scored ${score} points and earned ${achievements.length} achievements!`,
    });
    
    setTimeout(() => {
      nextActivity();
    }, 3000);
  };

  const handleRequestHelp = () => {
    toast({
      title: "Nelie is here to help! 💫",
      description: "Ask me anything about your current activity!",
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeProgress = Math.min((elapsedTime / TARGET_LESSON_TIME) * 100, 100);
  const remainingTime = Math.max(0, TARGET_LESSON_TIME - elapsedTime);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            🎓
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Preparing Your 20-Minute Lesson</h2>
          <p className="text-blue-200">Generating personalized learning activities...</p>
        </motion.div>
      </div>
    );
  }

  if (!dailyPlan || !currentActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Unable to Load Daily Program</h2>
            <p className="mb-6">There was an issue generating your personalized learning plan.</p>
            <Button onClick={initializeDailyProgram} className="bg-blue-600 hover:bg-blue-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Program Header */}
      <div className="p-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                20-Minute Daily Learning Program
              </h1>
              <p className="text-blue-200">
                Grade {gradeLevel} • Target: 20 minutes • {dailyPlan.activity_sequence.length} activities
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-600 text-white">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(remainingTime)} left
              </Badge>
              <Badge variant="secondary" className="bg-purple-600 text-white">
                <Brain className="w-4 h-4 mr-1" />
                Adaptive Learning
              </Badge>
            </div>
          </div>
          
          {/* Time Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Lesson Time Progress</span>
              <span className="text-blue-200">{formatTime(elapsedTime)} / 20:00</span>
            </div>
            <Progress value={timeProgress} className="h-3 bg-white/10" />
          </div>
          
          {/* Activity Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Activity Progress</span>
              <span className="text-blue-200">{Math.round(sessionProgress)}%</span>
            </div>
            <Progress value={sessionProgress} className="h-2 bg-white/10" />
          </div>
          
          {/* Activity Controls */}
          <div className="flex items-center space-x-4">
            {!isPlaying && !isPaused ? (
              <Button onClick={startActivity} className="bg-green-600 hover:bg-green-700 text-white">
                <Play className="w-4 h-4 mr-2" />
                Start 20-Min Lesson
              </Button>
            ) : isPaused ? (
              <Button onClick={startActivity} className="bg-green-600 hover:bg-green-700 text-white">
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            ) : (
              <Button onClick={pauseActivity} className="bg-orange-600 hover:bg-orange-700 text-white">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            
            <Button onClick={nextActivity} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Next Activity
            </Button>
            
            <Button 
              onClick={generateAdditionalContent} 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              disabled={isGeneratingMore}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isGeneratingMore ? 'Generating...' : 'More Content'}
            </Button>
            
            <Button onClick={resetProgram} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Current Activity Display */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activityIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {currentActivity.activity_data.content_type === 'educational_game' ? (
                  <EducationalGameEngine
                    subject="mathematics"
                    skillArea={dailyPlan.learning_units[0]?.skill_areas[0] || 'addition'}
                    theme="space_adventure"
                    onGameComplete={handleActivityComplete}
                    onRequestHelp={handleRequestHelp}
                  />
                ) : (
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <BookOpen className="w-6 h-6" />
                        <span>{currentActivity.title}</span>
                        <Badge className="bg-blue-600 text-white">
                          {currentActivity.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-white">
                      <div className="mb-6">
                        <p className="text-blue-200 mb-4">
                          {currentActivity.nelie_guidance.introduction_prompt}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{currentActivity.duration_minutes} minutes</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span>Level {currentActivity.difficulty_level}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold mb-4">Activity Content</h3>
                        <p className="text-blue-200 mb-6">
                          This would contain the actual {currentActivity.activity_data.content_type} content
                        </p>
                        <Button 
                          onClick={handleActivityComplete.bind(null, 85, ['participation'])}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Complete Activity
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Activity Timeline Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>20-Min Journey</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyPlan.activity_sequence.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border ${
                        index === activityIndex
                          ? 'bg-blue-600/20 border-blue-400 text-white'
                          : index < activityIndex
                          ? 'bg-green-600/20 border-green-400 text-green-200'
                          : 'bg-white/5 border-white/10 text-white/70'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {activity.type === 'game' && <Gamepad2 className="w-4 h-4" />}
                        {activity.type === 'instruction' && <BookOpen className="w-4 h-4" />}
                        {activity.type === 'practice' && <Target className="w-4 h-4" />}
                        <span className="text-sm font-medium">{activity.title}</span>
                      </div>
                      <div className="text-xs opacity-75">
                        {activity.duration_minutes} min • Level {activity.difficulty_level}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EnhancedNelieInterface
        currentSubject="mathematics"
        currentActivity={currentActivity.type}
        studentNeedsHelp={false}
        onHelpProvided={(helpType) => {
          console.log('Nelie provided help:', helpType);
        }}
      />
    </div>
  );
};

export default EnhancedDailyProgram;
