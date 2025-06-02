
import { supabase } from '@/integrations/supabase/client';

export interface ConceptMasteryData {
  conceptName: string;
  subject: string;
  masteryLevel: number;
  practiceCount: number;
  correctAttempts: number;
  totalAttempts: number;
  lastPractice: string;
}

export const conceptMasteryService = {
  async updateConceptMastery(
    userId: string,
    conceptName: string,
    subject: string,
    isCorrect: boolean,
    responseTime?: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('update_concept_mastery', {
        p_user_id: userId,
        p_concept_name: conceptName,
        p_subject: subject,
        p_is_correct: isCorrect,
        p_response_time: responseTime
      });

      if (error) {
        console.error('Error updating concept mastery:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateConceptMastery:', error);
      return false;
    }
  },

  async getConceptMastery(userId: string, subject: string): Promise<ConceptMasteryData[]> {
    try {
      const { data, error } = await supabase
        .from('concept_mastery')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .order('mastery_level', { ascending: false });

      if (error) {
        console.error('Error fetching concept mastery:', error);
        return [];
      }

      return (data || []).map(item => ({
        conceptName: item.concept_name,
        subject: item.subject,
        masteryLevel: item.mastery_level,
        practiceCount: item.practice_count,
        correctAttempts: item.correct_attempts,
        totalAttempts: item.total_attempts,
        lastPractice: item.last_practice
      }));
    } catch (error) {
      console.error('Error in getConceptMastery:', error);
      return [];
    }
  },

  async getWeakConcepts(userId: string, subject: string, threshold: number = 0.5): Promise<ConceptMasteryData[]> {
    try {
      const { data, error } = await supabase
        .from('concept_mastery')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .lt('mastery_level', threshold)
        .order('mastery_level', { ascending: true });

      if (error) {
        console.error('Error fetching weak concepts:', error);
        return [];
      }

      return (data || []).map(item => ({
        conceptName: item.concept_name,
        subject: item.subject,
        masteryLevel: item.mastery_level,
        practiceCount: item.practice_count,
        correctAttempts: item.correct_attempts,
        totalAttempts: item.total_attempts,
        lastPractice: item.last_practice
      }));
    } catch (error) {
      console.error('Error in getWeakConcepts:', error);
      return [];
    }
  },

  async getConceptsNeedingReview(userId: string, subject: string, daysThreshold: number = 7): Promise<ConceptMasteryData[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

      const { data, error } = await supabase
        .from('concept_mastery')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .lt('last_practice', cutoffDate.toISOString())
        .order('last_practice', { ascending: true });

      if (error) {
        console.error('Error fetching concepts needing review:', error);
        return [];
      }

      return (data || []).map(item => ({
        conceptName: item.concept_name,
        subject: item.subject,
        masteryLevel: item.mastery_level,
        practiceCount: item.practice_count,
        correctAttempts: item.correct_attempts,
        totalAttempts: item.total_attempts,
        lastPractice: item.last_practice
      }));
    } catch (error) {
      console.error('Error in getConceptsNeedingReview:', error);
      return [];
    }
  }
};
