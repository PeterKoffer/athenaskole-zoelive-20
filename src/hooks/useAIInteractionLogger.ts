
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { aiInteractionService, AIInteraction } from '@/services/aiInteractionService';

export const useAIInteractionLogger = () => {
  const { user } = useAuth();

  const logInteraction = useCallback(async (
    aiService: 'openai' | 'elevenlabs' | 'suno',
    interactionType: 'chat' | 'tts' | 'music_generation',
    promptText?: string,
    responseData?: any,
    tokensUsed?: number,
    costEstimate?: number,
    processingTimeMs?: number,
    success: boolean = true,
    errorMessage?: string,
    subject?: string,
    skillArea?: string,
    difficultyLevel?: number
  ) => {
    if (!user) return null;

    const interaction: Omit<AIInteraction, 'id'> = {
      user_id: user.id,
      ai_service: aiService,
      interaction_type: interactionType,
      prompt_text: promptText,
      response_data: responseData,
      tokens_used: tokensUsed,
      cost_estimate: costEstimate,
      processing_time_ms: processingTimeMs,
      success,
      error_message: errorMessage,
      subject,
      skill_area: skillArea,
      difficulty_level: difficultyLevel
    };

    try {
      const interactionId = await aiInteractionService.logInteraction(interaction);
      console.log(`Logged ${aiService} ${interactionType} interaction:`, interactionId);
      return interactionId;
    } catch (error) {
      console.error('Error logging AI interaction:', error);
      return null;
    }
  }, [user]);

  const logChatInteraction = useCallback(async (
    message: string,
    response: string,
    tokensUsed?: number,
    processingTime?: number,
    success: boolean = true,
    errorMessage?: string,
    subject?: string,
    skillArea?: string
  ) => {
    return logInteraction(
      'openai',
      'chat',
      message,
      { response },
      tokensUsed,
      undefined, // We'll calculate cost based on tokens
      processingTime,
      success,
      errorMessage,
      subject,
      skillArea
    );
  }, [logInteraction]);

  const logTTSInteraction = useCallback(async (
    text: string,
    audioUrl?: string,
    processingTime?: number,
    success: boolean = true,
    errorMessage?: string
  ) => {
    return logInteraction(
      'elevenlabs',
      'tts',
      text,
      { audioUrl },
      undefined,
      undefined,
      processingTime,
      success,
      errorMessage
    );
  }, [logInteraction]);

  const logMusicInteraction = useCallback(async (
    prompt: string,
    musicUrl?: string,
    processingTime?: number,
    success: boolean = true,
    errorMessage?: string
  ) => {
    return logInteraction(
      'suno',
      'music_generation',
      prompt,
      { musicUrl },
      undefined,
      undefined,
      processingTime,
      success,
      errorMessage
    );
  }, [logInteraction]);

  return {
    logInteraction,
    logChatInteraction,
    logTTSInteraction,
    logMusicInteraction
  };
};
