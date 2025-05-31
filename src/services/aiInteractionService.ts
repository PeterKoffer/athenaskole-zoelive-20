
import { supabase } from '@/integrations/supabase/client';

export interface AIInteraction {
  id?: string;
  user_id: string;
  ai_service: 'openai' | 'elevenlabs' | 'suno';
  interaction_type: 'chat' | 'tts' | 'music_generation';
  prompt_text?: string;
  response_data?: any;
  tokens_used?: number;
  cost_estimate?: number;
  processing_time_ms?: number;
  success: boolean;
  error_message?: string;
}

export class AIInteractionService {
  async logInteraction(interaction: Omit<AIInteraction, 'id'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('ai_interactions')
        .insert([interaction])
        .select()
        .single();

      if (error) {
        console.error('Error logging AI interaction:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error logging AI interaction:', error);
      return null;
    }
  }

  async getUserInteractions(userId: string, limit: number = 50): Promise<AIInteraction[]> {
    try {
      const { data, error } = await supabase
        .from('ai_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching AI interactions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching AI interactions:', error);
      return [];
    }
  }

  async getInteractionStats(userId: string, days: number = 30): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('ai_interactions')
        .select('ai_service, interaction_type, tokens_used, cost_estimate, success')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error fetching interaction stats:', error);
        return null;
      }

      const stats = {
        totalInteractions: data?.length || 0,
        totalTokens: data?.reduce((sum, item) => sum + (item.tokens_used || 0), 0) || 0,
        totalCost: data?.reduce((sum, item) => sum + (item.cost_estimate || 0), 0) || 0,
        successRate: data?.length ? (data.filter(item => item.success).length / data.length) * 100 : 0,
        serviceBreakdown: data?.reduce((acc, item) => {
          acc[item.ai_service] = (acc[item.ai_service] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {}
      };

      return stats;
    } catch (error) {
      console.error('Error calculating interaction stats:', error);
      return null;
    }
  }
}

export const aiInteractionService = new AIInteractionService();
