
import { supabase } from '@/integrations/supabase/client';
import { LearningPathway } from './types';

export const pathwayManagementService = {
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
  }
};
