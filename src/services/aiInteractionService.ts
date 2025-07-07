
export interface AIInteractionData {
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
  subject?: string;
  skill_area?: string;
  difficulty_level?: number;
}

export interface AIInteraction extends AIInteractionData {
  id: string;
  created_at: string;
}

export interface InteractionStats {
  totalInteractions: number;
  successRate: number;
  averageProcessingTime: number;
  tokensUsed: number;
  estimatedCost: number;
}

export const aiInteractionService = {
  async logInteraction(interaction: AIInteractionData): Promise<string> {
    console.log('📊 Logging AI interaction (stub implementation):', interaction);
    // Return a mock ID for now
    return `mock-interaction-${Date.now()}`;
  },

  async getInteractionHistory(userId: string, limit?: number): Promise<AIInteraction[]> {
    console.log('📚 Getting interaction history (stub implementation)');
    return [];
  },

  async getInteractionStats(userId: string): Promise<InteractionStats> {
    console.log('📊 Getting interaction stats (stub implementation)');
    return {
      totalInteractions: 0,
      successRate: 0,
      averageProcessingTime: 0,
      tokensUsed: 0,
      estimatedCost: 0
    };
  }
};
