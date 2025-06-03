
import { supabase } from '@/integrations/supabase/client';

export const pathGenerationService = {
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
  }
};
