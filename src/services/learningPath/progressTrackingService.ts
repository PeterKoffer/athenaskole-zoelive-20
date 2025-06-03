
import { supabase } from '@/integrations/supabase/client';

export const progressTrackingService = {
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
  }
};
