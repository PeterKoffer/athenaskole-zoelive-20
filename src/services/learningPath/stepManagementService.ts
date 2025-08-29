
import { supabase } from '@/lib/supabaseClient';
import { LearningPathStep } from './types';

export const stepManagementService = {
  async getLearningPathSteps(pathwayId: string): Promise<LearningPathStep[]> {
    console.log('📋 Getting learning path steps for pathway:', pathwayId);
    
    // Since learning_pathway_steps table doesn't exist, return mock data based on learning_paths
    try {
      const { data: pathway } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('id', pathwayId)
        .single();

      if (!pathway) {
        return [];
      }

      // Generate mock steps based on total_steps
      const steps: LearningPathStep[] = [];
      for (let i = 1; i <= (pathway.total_steps || 5); i++) {
        steps.push({
          id: `step_${i}_${pathwayId}`,
          pathwayId: pathwayId,
          stepNumber: i,
          learningObjectiveId: `obj_${i}`,
          contentId: `content_${i}`,
          isCompleted: i < (pathway.current_step || 1),
          completionTime: i < (pathway.current_step || 1) ? new Date().toISOString() : undefined,
          score: i < (pathway.current_step || 1) ? Math.floor(Math.random() * 40) + 60 : undefined
        });
      }

      return steps;
    } catch (error) {
      console.error('Error in getLearningPathSteps:', error);
      return [];
    }
  },

  async getRecommendedNextSteps(userId: string, subject: string): Promise<LearningPathStep[]> {
    console.log('🎯 Getting recommended next steps for user:', userId, 'subject:', subject);
    
    try {
      // Get user's active learning path for the subject
      const { data: pathways } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('is_active', true)
        .limit(1);

      if (!pathways || pathways.length === 0) {
        return [];
      }

      const pathway = pathways[0];
      const allSteps = await this.getLearningPathSteps(pathway.id);
      
      // Return next 3 uncompleted steps
      return allSteps
        .filter(step => !step.isCompleted)
        .slice(0, 3);
    } catch (error) {
      console.error('Error in getRecommendedNextSteps:', error);
      return [];
    }
  }
};
