
import { useState, useEffect, useCallback } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { LessonActivity } from '../types/LessonTypes';
import { dailyLessonGenerator } from '@/services/dailyLessonGenerator';
import { DEFAULT_LESSON_SECONDS } from '@/constants/lesson';
import { useAuth } from '@/hooks/useAuth';

interface UseOptimizedLessonManagerProps {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
}

export const useOptimizedLessonManager = ({
  subject,
  skillArea,
  onLessonComplete
}: UseOptimizedLessonManagerProps) => {
  const [activities, setActivities] = useState<LessonActivity[]>([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const { speak, isSpeaking, stop } = useUnifiedSpeech();
  const { user } = useAuth();
  
  const targetLessonLength = DEFAULT_LESSON_SECONDS; // default lesson length in seconds

  // Initialize lesson activities using the new AI prompt template system
  useEffect(() => {
    const initializeLesson = async () => {
      console.log(`🤖 Initializing AI-powered lesson for ${subject} - ${skillArea}`);
      setIsInitializing(true);
      
      try {
        if (!user?.id) {
          throw new Error('User not authenticated');
        }

        // Use the daily lesson generator with new AI prompt template system
        const generatedActivities = await dailyLessonGenerator.generateDailyLesson({
          subject,
          skillArea,
          userId: user.id,
          gradeLevel: 3, // Default grade level
          currentDate: new Date().toISOString().split('T')[0]
        });
        
        setActivities(generatedActivities);
        console.log(`✅ Generated ${generatedActivities.length} AI-powered activities for ${subject}`);
      } catch (error) {
        console.error('❌ Error generating AI lesson activities:', error);
        // Fallback to basic activities if generation fails
        const fallbackActivities: LessonActivity[] = [
          {
            id: 'intro-1',
            type: 'introduction',
            title: `Welcome to ${subject}`,
            duration: 120,
            content: {
              text: `Welcome to your ${subject} learning session! Today we'll explore ${skillArea} through interactive activities and engaging content.`
            },
            subject,
            skillArea
          }
        ];
        setActivities(fallbackActivities);
      }
      
      setIsInitializing(false);
    };

    initializeLesson();
  }, [subject, skillArea, user?.id]);

  // Timer for lesson duration
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentActivity = activities[currentActivityIndex] || null;
  const totalRealActivities = activities.length;

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    console.log(`📝 Activity completed: ${currentActivity?.title}, correct: ${wasCorrect}`);
    console.log(`📊 Progress: ${currentActivityIndex + 1}/${activities.length} activities`);
    
    if (wasCorrect) {
      setScore(prev => prev + 10);
      setCorrectStreak(prev => prev + 1);
    } else {
      setCorrectStreak(0);
    }

    // Move to next activity or complete lesson
    if (currentActivityIndex < activities.length - 1) {
      const nextIndex = currentActivityIndex + 1;
      console.log(`➡️ Moving to next activity: ${nextIndex + 1}/${activities.length}`);
      setCurrentActivityIndex(nextIndex);
    } else {
      console.log('🎉 Lesson completed!');
      onLessonComplete();
    }
  }, [currentActivity, currentActivityIndex, activities.length, onLessonComplete]);

  const handleReadRequest = useCallback((text: string) => {
    console.log('🔊 Read request:', text.substring(0, 50) + '...');
    speak(text);
  }, [speak]);

  const toggleMute = useCallback(() => {
    if (isSpeaking) {
      stop();
    }
  }, [isSpeaking, stop]);

  return {
    currentActivityIndex,
    currentActivity,
    totalRealActivities,
    timeElapsed,
    score,
    correctStreak,
    targetLessonLength,
    isInitializing,
    handleActivityComplete,
    handleReadRequest,
    isSpeaking,
    toggleMute
  };
};
