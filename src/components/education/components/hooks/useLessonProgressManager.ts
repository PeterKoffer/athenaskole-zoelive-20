
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LessonProgressService } from '@/services/lessonProgressService';
import { SubjectQuestionService } from '@/services/subjectQuestionService';

interface UseLessonProgressManagerProps {
  subject: string;
  skillArea: string;
  lessonActivities: any[];
  currentActivityIndex: number;
  score: number;
  timeElapsed: number;
  onProgressLoaded?: (progress: any) => void;
}

export const useLessonProgressManager = ({
  subject,
  skillArea,
  lessonActivities,
  currentActivityIndex,
  score,
  timeElapsed,
  onProgressLoaded
}: UseLessonProgressManagerProps) => {
  const { user } = useAuth();
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);

  // Load existing progress on component mount
  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.id) {
        setIsLoadingProgress(false);
        return;
      }

      console.log('🔄 Loading lesson progress for:', { subject, skillArea, userId: user.id });
      
      const progress = await LessonProgressService.getLessonProgress(user.id, subject, skillArea);
      
      if (progress) {
        console.log('📚 Found existing progress:', progress);
        const usedIds = (progress.lesson_data?.usedQuestionIds as string[]) || [];
        setUsedQuestionIds(usedIds);
        
        if (onProgressLoaded) {
          onProgressLoaded(progress);
        }
      } else {
        console.log('📝 No existing progress found, starting fresh');
      }
      
      setIsLoadingProgress(false);
    };

    loadProgress();
  }, [user?.id, subject, skillArea, onProgressLoaded]);

  // Save progress whenever important state changes
  const saveProgress = useCallback(async () => {
    if (!user?.id) return;

    const progressData = {
      user_id: user.id,
      subject,
      skill_area: skillArea,
      current_activity_index: currentActivityIndex,
      total_activities: lessonActivities.length,
      lesson_data: {
        usedQuestionIds,
        timestamp: Date.now()
      },
      score,
      time_elapsed: timeElapsed,
      is_completed: false
    };

    console.log('💾 Saving lesson progress:', progressData);
    
    await LessonProgressService.saveLessonProgress(progressData);
  }, [user?.id, subject, skillArea, currentActivityIndex, lessonActivities.length, score, timeElapsed, usedQuestionIds]);

  // Mark lesson as completed
  const completeLessonProgress = useCallback(async () => {
    if (!user?.id) return;

    console.log('✅ Completing lesson progress');
    await LessonProgressService.completeLessonProgress(user.id, subject, skillArea);
  }, [user?.id, subject, skillArea]);

  // Generate a new subject-specific question
  const generateSubjectQuestion = useCallback(async () => {
    console.log('🎯 Generating subject-specific question for:', subject, skillArea);
    
    const questionTemplate = await SubjectQuestionService.getRandomQuestionForSubject(
      subject, 
      skillArea, 
      usedQuestionIds
    );

    if (!questionTemplate) {
      console.warn('⚠️ No more unique questions available for this subject/skill');
      return null;
    }

    const dynamicQuestion = await SubjectQuestionService.createDynamicQuestion(
      subject,
      skillArea,
      1,
      usedQuestionIds
    );
    
    if (dynamicQuestion) {
      // Track this question as used
      setUsedQuestionIds(prev => [...prev, questionTemplate.id]);
      
      console.log('✅ Generated subject question:', dynamicQuestion.content?.question);
      return dynamicQuestion;
    }
    
    return null;
  }, [subject, skillArea, usedQuestionIds]);

  // Reset progress (start new lesson)
  const resetProgress = useCallback(async () => {
    if (!user?.id) return;

    console.log('🔄 Resetting lesson progress');
    await LessonProgressService.deleteLessonProgress(user.id, subject, skillArea);
    setUsedQuestionIds([]);
  }, [user?.id, subject, skillArea]);

  return {
    isLoadingProgress,
    usedQuestionIds,
    saveProgress,
    completeLessonProgress,
    generateSubjectQuestion,
    resetProgress
  };
};
