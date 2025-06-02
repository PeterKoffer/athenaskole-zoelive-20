
import { supabase } from '@/integrations/supabase/client';

export interface AIInteraction {
  id?: string;
  user_id: string;
  ai_service: 'openai' | 'elevenlabs' | 'suno';
  interaction_type: 'chat' | 'tts' | 'music_generation';
  prompt_text?: string;
  response_data?: any;
  success: boolean;
  error_message?: string;
  created_at?: string;
  subject?: string;
  skill_area?: string;
  difficulty_level?: number;
  tokens_used?: number;
  cost_estimate?: number;
  processing_time_ms?: number;
}

export const aiInteractionService = {
  async logInteraction(interaction: Omit<AIInteraction, 'id'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('ai_interactions')
        .insert({
          user_id: interaction.user_id,
          ai_service: interaction.ai_service,
          interaction_type: interaction.interaction_type,
          prompt_text: interaction.prompt_text,
          response_data: interaction.response_data,
          success: interaction.success,
          error_message: interaction.error_message,
          subject: interaction.subject,
          skill_area: interaction.skill_area,
          difficulty_level: interaction.difficulty_level,
          tokens_used: interaction.tokens_used,
          cost_estimate: interaction.cost_estimate,
          processing_time_ms: interaction.processing_time_ms
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error logging AI interaction:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error in logInteraction:', error);
      return null;
    }
  },

  async getUserInteractions(userId: string, limit: number = 50): Promise<AIInteraction[]> {
    try {
      const { data, error } = await supabase
        .from('ai_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user interactions:', error);
        return [];
      }

      // Transform the data to match AIInteraction interface
      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        ai_service: item.ai_service as 'openai' | 'elevenlabs' | 'suno',
        interaction_type: item.interaction_type as 'chat' | 'tts' | 'music_generation',
        prompt_text: item.prompt_text,
        response_data: item.response_data,
        success: item.success,
        error_message: item.error_message,
        created_at: item.created_at,
        subject: item.subject,
        skill_area: item.skill_area,
        difficulty_level: item.difficulty_level,
        tokens_used: item.tokens_used,
        cost_estimate: item.cost_estimate,
        processing_time_ms: item.processing_time_ms
      }));
    } catch (error) {
      console.error('Error in getUserInteractions:', error);
      return [];
    }
  },

  async getInteractionStats(userId: string): Promise<{
    total: number;
    successful: number;
    failed: number;
    byService: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from('ai_interactions')
        .select('ai_service, success')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching interaction stats:', error);
        return { total: 0, successful: 0, failed: 0, byService: {} };
      }

      const stats = {
        total: data.length,
        successful: data.filter(i => i.success).length,
        failed: data.filter(i => !i.success).length,
        byService: {} as Record<string, number>
      };

      data.forEach(interaction => {
        stats.byService[interaction.ai_service] = (stats.byService[interaction.ai_service] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error in getInteractionStats:', error);
      return { total: 0, successful: 0, failed: 0, byService: {} };
    }
  }
};
