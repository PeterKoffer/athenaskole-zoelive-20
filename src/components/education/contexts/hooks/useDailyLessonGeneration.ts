
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LessonActivity } from '../../components/types/LessonTypes';
import { dailyLessonGenerator } from '@/services/dailyLessonGenerator';

interface UseDailyLessonGenerationProps {
  subject: string;
  skillArea: string;
  gradeLevel: number;
  staticActivities: LessonActivity[];
}

export const useDailyLessonGeneration = ({
  subject,
  skillArea,
  gradeLevel,
  staticActivities
}: UseDailyLessonGenerationProps) => {
  const { user } = useAuth();
  const [allActivities, setAllActivities] = useState<LessonActivity[]>(staticActivities);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [lastGeneratedDate, setLastGeneratedDate] = useState<string>('');

  // Get today's date for lesson generation
  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  // Generate daily lesson based on curriculum and student progress
  const generateDailyLesson = useCallback(async (forceRegenerate = false) => {
    if (!user?.id) {
      console.log('⚠️ No user available, using static activities');
      setAllActivities(staticActivities);
      setIsLoadingActivities(false);
      return;
    }

    const currentDate = getCurrentDate();
    
    // Check if we need to generate a new lesson
    if (!forceRegenerate && lastGeneratedDate === currentDate && allActivities.length > 0) {
      console.log('📚 Using existing lesson for today');
      setIsLoadingActivities(false);
      return;
    }

    console.log(`🎯 Generating NEW daily lesson for ${subject} - ${currentDate}`);
    setIsLoadingActivities(true);

    try {
      // Clear cache if force regenerating
      if (forceRegenerate) {
        dailyLessonGenerator.clearTodaysLesson(user.id, subject, currentDate);
      }

      const newActivities = await dailyLessonGenerator.generateDailyLesson({
        subject,
        skillArea,
        userId: user.id,
        gradeLevel: gradeLevel || 6,
        currentDate
      });

      console.log(`✅ Generated ${newActivities.length} new activities for ${subject}`);
      setAllActivities(newActivities);
      setLastGeneratedDate(currentDate);
      
    } catch (error) {
      console.error('❌ Failed to generate daily lesson, using fallback:', error);
      // Fallback to static activities if generation fails
      setAllActivities(staticActivities.length > 0 ? staticActivities : []);
    } finally {
      setIsLoadingActivities(false);
    }
  }, [user?.id, subject, skillArea, gradeLevel, staticActivities, lastGeneratedDate, allActivities.length]);

  // Generate lesson on mount and when date changes
  useEffect(() => {
    generateDailyLesson();
  }, [generateDailyLesson]);

  // Check for date change every minute to regenerate lessons
  useEffect(() => {
    const checkDateChange = () => {
      const currentDate = getCurrentDate();
      if (lastGeneratedDate && lastGeneratedDate !== currentDate) {
        console.log('📅 Date changed, generating new lesson');
        generateDailyLesson();
      }
    };

    const interval = setInterval(checkDateChange, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastGeneratedDate, generateDailyLesson]);

  // Regenerate lesson function (for manual refresh)
  const regenerateLesson = useCallback(async () => {
    console.log('🔄 Manual lesson regeneration requested');
    await generateDailyLesson(true);
  }, [generateDailyLesson]);

  return {
    allActivities,
    isLoadingActivities,
    regenerateLesson
  };
};
