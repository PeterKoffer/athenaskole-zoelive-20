
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
  subject?: string;
  skill_area?: string;
  difficulty_level?: number;
}

export class AIInteractionService {
  async getInteractionStats(userId: string): Promise<any> {
    // Mock implementation
    return {
      totalInteractions: 42,
      successRate: 87.5,
      totalTokens: 15420,
      totalCost: 0.0234,
      serviceBreakdown: {
        'question-generation': 25,
        'explanation': 12,
        'feedback': 5
      }
    };
  }

  async logInteraction(interaction: Omit<AIInteraction, 'id'>): Promise<string | null> {
    // Mock implementation
    console.log('Logging AI interaction:', interaction);
    return `interaction_${Date.now()}`;
  }
}

export const aiInteractionService = new AIInteractionService();
