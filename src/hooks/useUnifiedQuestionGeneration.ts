import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UniqueQuestion } from '@/services/globalQuestionUniquenessService';
import { 
  unifiedQuestionGeneration, 
  QuestionGenerationConfig, 
  QuestionGenerationResult 
} from '@/services/unifiedQuestionGeneration';

export interface UseUnifiedQuestionGenerationProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
  gradeLevel?: number;
  standardsAlignment?: Record<string, unknown> | null;
  maxAttempts?: number;
  enablePersistence?: boolean;
}

/**
 * Unified hook for question generation with guaranteed uniqueness
 * Replaces multiple fragmented hooks with a single, centralized approach
 */
export const useUnifiedQuestionGeneration = (props: UseUnifiedQuestionGenerationProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<UniqueQuestion | null>(null);
  const [generationStats, setGenerationStats] = useState({
    totalGenerated: 0,
    aiGenerated: 0,
    fallbackGenerated: 0,
    averageAttempts: 0
  });

  const generateUniqueQuestion = useCallback(async (questionContext?: Record<string, unknown>): Promise<UniqueQuestion> => {
    setIsGenerating(true);
    
    try {
      const config: QuestionGenerationConfig = {
        ...props,
        questionContext,
      };

      console.log(`🚀 Unified Question Generation: Starting for ${props.subject} - ${props.skillArea}`);
      
      const result: QuestionGenerationResult = await unifiedQuestionGeneration.generateUniqueQuestion(config);
      
      // Update statistics
      setGenerationStats(prev => ({
        totalGenerated: prev.totalGenerated + 1,
        aiGenerated: prev.aiGenerated + (result.generationMethod === 'ai' ? 1 : 0),
        fallbackGenerated: prev.fallbackGenerated + (result.generationMethod === 'fallback' ? 1 : 0),
        averageAttempts: Math.round(((prev.averageAttempts * prev.totalGenerated) + result.attempts) / (prev.totalGenerated + 1))
      }));

      setCurrentQuestion(result.question);

      // Show appropriate toast based on generation method
      if (result.generationMethod === 'ai') {
        toast({
          title: "🎯 AI Question Generated!",
          description: `Unique ${props.gradeLevel ? `Grade ${props.gradeLevel}` : ''} question created in ${result.attempts} attempt${result.attempts > 1 ? 's' : ''}`,
          duration: 2000
        });
      } else {
        toast({
          title: "📚 Smart Fallback Question!",
          description: `Guaranteed unique practice question created`,
          duration: 2000
        });
      }

      console.log(`✅ Question generated successfully:`, {
        id: result.question.id,
        method: result.generationMethod,
        attempts: result.attempts,
        uniqueness: result.uniquenessGuaranteed
      });

      return result.question;

    } catch (error) {
      console.error('❌ Unified question generation failed:', error);
      
      toast({
        title: "Generation Error",
        description: "Could not generate question. Please try again.",
        variant: "destructive",
        duration: 3000
      });
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [props, toast]);

  const saveQuestionHistory = useCallback(async (
    question: UniqueQuestion,
    userAnswer: number,
    isCorrect: boolean,
    responseTime: number,
    additionalContext?: Record<string, unknown>
  ) => {
    try {
      await unifiedQuestionGeneration.saveQuestionHistory(
        question,
        userAnswer,
        isCorrect,
        responseTime,
        {
          ...additionalContext,
          generationStats,
          timestamp: new Date().toISOString()
        }
      );
      
      console.log(`📊 Question history saved for ${question.id}`);
    } catch (error) {
      console.warn('Could not save question history:', error);
      // Don't throw - this shouldn't break the user experience
    }
  }, [generationStats]);

  const getGenerationStats = useCallback(() => {
    return {
      ...generationStats,
      successRate: generationStats.totalGenerated > 0 
        ? Math.round((generationStats.totalGenerated / Math.max(generationStats.averageAttempts * generationStats.totalGenerated, 1)) * 100)
        : 0,
      aiSuccessRate: generationStats.totalGenerated > 0
        ? Math.round((generationStats.aiGenerated / generationStats.totalGenerated) * 100)
        : 0
    };
  }, [generationStats]);

  const resetStats = useCallback(() => {
    setGenerationStats({
      totalGenerated: 0,
      aiGenerated: 0,
      fallbackGenerated: 0,
      averageAttempts: 0
    });
  }, []);

  return {
    // Core functionality
    generateUniqueQuestion,
    saveQuestionHistory,
    
    // State
    isGenerating,
    currentQuestion,
    
    // Statistics and management
    generationStats: getGenerationStats(),
    resetStats,
    
    // Utility
    questionId: currentQuestion?.id || null,
    isQuestionLoaded: currentQuestion !== null
  };
};