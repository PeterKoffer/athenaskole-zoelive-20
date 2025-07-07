
// Progress Tracking Service

import { supabase } from '@/integrations/supabase/client';

export class ProgressTrackingService {
  async getStepProgress(userId: string, stepId: string): Promise<any> {
    console.log('📊 Progress Tracking Service: getStepProgress (stub implementation)');
    
    // Use learning_paths table instead of non-existent learning_pathway_steps
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('user_id', userId)
      .eq('id', stepId)
      .single();

    if (error) {
      console.error('Error fetching step progress:', error);
      return null;
    }

    return data;
  }

  async updateStepProgress(userId: string, stepId: string, progress: number): Promise<boolean> {
    console.log('📈 Progress Tracking Service: updateStepProgress (stub implementation)');
    
    // Use learning_paths table instead of non-existent learning_pathway_steps
    const { error } = await supabase
      .from('learning_paths')
      .update({
        completion_percentage: progress,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('id', stepId);

    if (error) {
      console.error('Error updating step progress:', error);
      return false;
    }

    return true;
  }

  async getAllUserProgress(userId: string): Promise<any[]> {
    console.log('📋 Progress Tracking Service: getAllUserProgress');
    
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }

    return data || [];
  }
}

export const progressTrackingService = new ProgressTrackingService();
