
import { supabase } from '@/integrations/supabase/client';

export interface LearningPathway {
  id: string;
  userId: string;
  subject: string;
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  difficultyProgression: number[];
  estimatedCompletionTime: number;
  isActive: boolean;
  createdAt: string;
}

export interface LearningPathStep {
  id: string;
  pathwayId: string;
  stepNumber: number;
  learningObjectiveId: string;
  contentId?: string;
  isCompleted: boolean;
  completionTime?: string;
  score?: number;
}

export const learningPathService = {
  async generateLearningPath(
    userId: string,
    subject: string,
    targetConcepts?: string[]
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('generate_learning_path', {
        p_user_id: userId,
        p_subject: subject,
        p_target_concepts: targetConcepts
      });

      if (error) {
        console.error('Error generating learning path:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in generateLearningPath:', error);
      return null;
    }
  },

  async getUserLearningPaths(userId: string): Promise<LearningPathway[]> {
    try {
      const { data, error } = await supabase
        .from('learning_pathways')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching learning paths:', error);
        return [];
      }

      return (data || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        subject: item.subject,
        title: item.title,
        description: item.description || '',
        currentStep: item.current_step || 0,
        totalSteps: item.total_steps || 0,
        difficultyProgression: Array.isArray(item.difficulty_progression) 
          ? item.difficulty_progression as number[]
          : [],
        estimatedCompletionTime: item.estimated_completion_time || 0,
        isActive: item.is_active || false,
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error in getUserLearningPaths:', error);
      return [];
    }
  },

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

  async updatePathProgress(
    pathwayId: string,
    stepId: string,
    score: number,
    isCompleted: boolean = true
  ): Promise<boolean> {
    try {
      // Update the specific step
      const { error: stepError } = await supabase
        .from('learning_pathway_steps')
        .update({
          is_completed: isCompleted,
          completion_time: new Date().toISOString(),
          score: score
        })
        .eq('id', stepId);

      if (stepError) {
        console.error('Error updating path step:', stepError);
        return false;
      }

      // Update pathway current step
      const { data: steps } = await supabase
        .from('learning_pathway_steps')
        .select('step_number')
        .eq('pathway_id', pathwayId)
        .eq('is_completed', true)
        .order('step_number', { ascending: false })
        .limit(1);

      if (steps && steps.length > 0) {
        const { error: pathwayError } = await supabase
          .from('learning_pathways')
          .update({
            current_step: steps[0].step_number,
            updated_at: new Date().toISOString()
          })
          .eq('id', pathwayId);

        if (pathwayError) {
          console.error('Error updating pathway progress:', pathwayError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error in updatePathProgress:', error);
      return false;
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
