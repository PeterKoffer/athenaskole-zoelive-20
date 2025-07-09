
// Learning Path Service Implementation

import { supabase } from '@/integrations/supabase/client';
import { LearningPathway, LearningPathStep, LearningPathService } from './types';

class LearningPathServiceImpl implements LearningPathService {
  async getUserLearningPaths(userId: string): Promise<LearningPathway[]> {
    console.log('📚 Getting user learning paths for:', userId);
    
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching learning paths:', error);
        return [];
      }

      return (data || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        subject: item.subject,
        title: item.path_name,
        description: `Learning path for ${item.subject}`,
        currentStep: item.current_step,
        totalSteps: item.total_steps,
        estimatedCompletionTime: 60, // Default estimate
        isActive: item.is_active || false,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      console.error('Error in getUserLearningPaths:', error);
      return [];
    }
  }

  async generateLearningPath(userId: string, subject: string): Promise<string | null> {
    console.log('🔄 Generating learning path for user:', userId, 'subject:', subject);
    
    try {
      const pathData = {
        user_id: userId,
        subject: subject,
        path_name: `${subject} Learning Path`,
        current_step: 1,
        total_steps: 10,
        difficulty_progression: { levels: [1, 2, 3, 4, 5] },
        recommended_content: [`${subject}_basics`, `${subject}_intermediate`, `${subject}_advanced`],
        completion_percentage: 0,
        is_active: true
      };

      const { data, error } = await supabase
        .from('learning_paths')
        .insert(pathData)
        .select()
        .single();

      if (error) {
        console.error('Error creating learning path:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error in generateLearningPath:', error);
      return null;
    }
  }

  async getLearningPathSteps(pathwayId: string): Promise<LearningPathStep[]> {
    console.log('📋 Getting learning path steps for pathway:', pathwayId);
    
    // Since learning_pathway_steps table doesn't exist, return mock data for now
    return [
      {
        id: `step_1_${pathwayId}`,
        pathwayId: pathwayId,
        stepNumber: 1,
        learningObjectiveId: 'obj_1',
        contentId: 'content_1',
        isCompleted: false,
        completionTime: undefined,
        score: undefined
      },
      {
        id: `step_2_${pathwayId}`,
        pathwayId: pathwayId,
        stepNumber: 2,
        learningObjectiveId: 'obj_2', 
        contentId: 'content_2',
        isCompleted: false,
        completionTime: undefined,
        score: undefined
      }
    ];
  }
}

export const learningPathService = new LearningPathServiceImpl();
