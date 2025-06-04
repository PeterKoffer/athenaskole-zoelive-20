
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userLearningProfileService } from '@/services/userLearningProfileService';
import { conceptMasteryService } from '@/services/conceptMasteryService';

interface StudentProgress {
  currentLevel: number;
  overallAccuracy: number;
  strengths: string[];
  weaknesses: string[];
  masteredConcepts: string[];
  totalSessions: number;
  lastSessionDate: string | null;
}

export const useStudentProgressTracker = (subject: string, skillArea: string) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      console.log('📊 Loading student progress...');
      
      const [profile, conceptMastery] = await Promise.all([
        userLearningProfileService.getLearningProfile(user.id, subject, skillArea),
        conceptMasteryService.getConceptMastery(user.id, subject)
      ]);

      const studentProgress: StudentProgress = {
        currentLevel: profile?.current_difficulty_level || 1,
        overallAccuracy: profile?.overall_accuracy || 0,
        strengths: profile?.strengths || [],
        weaknesses: profile?.weaknesses || [],
        masteredConcepts: conceptMastery
          .filter(c => c.masteryLevel > 0.8)
          .map(c => c.conceptName),
        totalSessions: profile?.total_sessions || 0,
        lastSessionDate: profile?.last_session_date || null
      };

      setProgress(studentProgress);
      console.log('✅ Student progress loaded:', studentProgress);
      
    } catch (error) {
      console.error('❌ Error loading student progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, subject, skillArea]);

  const updateProgress = useCallback(async (sessionData: {
    questionsAnswered: number;
    correctAnswers: number;
    conceptsWorkedOn: string[];
    timeSpent: number;
  }) => {
    if (!user?.id || !progress) return;

    try {
      console.log('💾 Updating student progress...');
      
      const newAccuracy = (sessionData.correctAnswers / sessionData.questionsAnswered) * 100;
      const totalAttempts = progress.totalSessions + 1;
      const overallAccuracy = ((progress.overallAccuracy * progress.totalSessions) + newAccuracy) / totalAttempts;

      // Update concept mastery for each concept worked on
      for (const concept of sessionData.conceptsWorkedOn) {
        const conceptCorrect = sessionData.correctAnswers / sessionData.questionsAnswered;
        await conceptMasteryService.updateConceptMastery(
          user.id,
          concept,
          subject,
          conceptCorrect > 0.5
        );
      }

      // Update learning profile
      const profileUpdates = {
        user_id: user.id,
        subject,
        skill_area: skillArea,
        overall_accuracy: overallAccuracy,
        total_sessions: totalAttempts,
        total_time_spent: (progress.totalSessions * 10) + Math.round(sessionData.timeSpent / 60),
        last_session_date: new Date().toISOString(),
        last_topic_covered: skillArea,
        updated_at: new Date().toISOString()
      };

      await userLearningProfileService.createOrUpdateProfile(profileUpdates);
      
      // Reload progress to get fresh data
      await loadProgress();
      
      console.log('✅ Student progress updated successfully');
      
    } catch (error) {
      console.error('❌ Error updating student progress:', error);
    }
  }, [user?.id, progress, subject, skillArea, loadProgress]);

  const getRecommendedDifficulty = useCallback(() => {
    if (!progress) return 1;
    
    if (progress.overallAccuracy > 85) return Math.min(progress.currentLevel + 1, 5);
    if (progress.overallAccuracy < 60) return Math.max(progress.currentLevel - 1, 1);
    return progress.currentLevel;
  }, [progress]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    progress,
    loading,
    updateProgress,
    getRecommendedDifficulty,
    refresh: loadProgress
  };
};
