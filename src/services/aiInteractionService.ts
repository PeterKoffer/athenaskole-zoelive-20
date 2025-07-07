
import { supabase } from '@/integrations/supabase/client';

export interface AIInteractionData {
  interaction_type: string;
  ai_service: string;
  prompt_text?: string;
  response_data?: any;
  success: boolean;
  tokens_used?: number;
  processing_time_ms?: number;
  cost_estimate?: number;
  error_message?: string;
  // Additional fields that might be needed
  subject?: string;
  skill_area?: string;
  difficulty_level?: number;
}

export const aiInteractionService = {
  async logInteraction(userId: string, interactionData: AIInteractionData) {
    try {
      const { data, error } = await supabase
        .from('ai_interactions')
        .insert({
          user_id: userId,
          ...interactionData
        })
        .select()
        .single();

      if (error) {
        console.error('Error logging AI interaction:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected error logging AI interaction:', error);
      return null;
    }
  },

  async getInteractionHistory(userId: string, limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('ai_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching interaction history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching interaction history:', error);
      return [];
    }
  },

  async getInteractionStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('ai_interactions')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching interaction stats:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return {
          totalInteractions: 0,
          successRate: 0,
          totalTokens: 0,
          totalCost: 0,
          averageProcessingTime: 0
        };
      }

      const totalInteractions = data.length;
      const successfulInteractions = data.filter(item => item.success).length;
      const successRate = (successfulInteractions / totalInteractions) * 100;
      const totalTokens = data.reduce((sum, item) => sum + (item.tokens_used || 0), 0);
      const totalCost = data.reduce((sum, item) => sum + (item.cost_estimate || 0), 0);
      const averageProcessingTime = data.reduce((sum, item) => sum + (item.processing_time_ms || 0), 0) / totalInteractions;

      return {
        totalInteractions,
        successRate,
        totalTokens,
        totalCost,
        averageProcessingTime
      };
    } catch (error) {
      console.error('Unexpected error calculating interaction stats:', error);
      return null;
    }
  }
};
