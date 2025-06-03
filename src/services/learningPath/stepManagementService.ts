
import { supabase } from '@/integrations/supabase/client';
import { LearningPathStep } from './types';

export const stepManagementService = {
  async getLearningPathSteps(pathwayId: string): Promise<LearningPathStep[]> {
    try {
      const { data, error } = await supabase
        .from('learning_pathway_steps')
        .select(`
          *,
          learning_objectives(
            id,
            title,
            description,
            difficulty_level,
            estimated_time_minutes
          )
        `)
        .eq('pathway_id', pathwayId)
        .order('step_number');

      if (error) {
        console.error('Error fetching learning path steps:', error);
        return [];
      }

      return (data || []).map(item => ({
        id: item.id,
        pathwayId: item.pathway_id,
        stepNumber: item.step_number,
        learningObjectiveId: item.learning_objective_id,
        contentId: item.content_id,
        isCompleted: item.is_completed || false,
        completionTime: item.completion_time,
        score: item.score
      }));
    } catch (error) {
      console.error('Error in getLearningPathSteps:', error);
      return [];
    }
  },

  async getRecommendedNextSteps(userId: string, subject: string): Promise<LearningPathStep[]> {
    try {
      // Get user's active learning path for the subject
      const { data: pathways } = await supabase
        .from('learning_pathways')
        .select('id, current_step')
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('is_active', true)
        .limit(1);

      if (!pathways || pathways.length === 0) {
        return [];
      }

      const pathway = pathways[0];
      
      // Get next uncompleted steps
      const { data: steps, error } = await supabase
        .from('learning_pathway_steps')
        .select(`
          *,
          learning_objectives(
            id,
            title,
            description,
            difficulty_level,
            estimated_time_minutes
          )
        `)
        .eq('pathway_id', pathway.id)
        .eq('is_completed', false)
        .order('step_number')
        .limit(3);

      if (error) {
        console.error('Error fetching recommended next steps:', error);
        return [];
      }

      return (steps || []).map(item => ({
        id: item.id,
        pathwayId: item.pathway_id,
        stepNumber: item.step_number,
        learningObjectiveId: item.learning_objective_id,
        contentId: item.content_id,
        isCompleted: item.is_completed || false,
        completionTime: item.completion_time,
        score: item.score
      }));
    } catch (error) {
      console.error('Error in getRecommendedNextSteps:', error);
      return [];
    }
  }
};
