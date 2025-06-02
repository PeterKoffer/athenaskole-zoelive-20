
import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { aiContentGenerator } from '@/services/content/aiContentGenerator';
import { useToast } from '@/hooks/use-toast';

export interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives: string[];
  estimatedTime: number;
}

export const useQuestionGeneration = (subject: string, skillArea: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isGenerating = useRef(false);

  const generateQuestion = useCallback(async () => {
    if (!user) {
      console.log('❌ No user found, cannot generate AI question');
      setError('User not authenticated');
      return;
    }

    if (isGenerating.current) {
      console.log('⏳ AI generation already in progress, skipping...');
      return;
    }

    isGenerating.current = true;
    setIsLoading(true);
    setError(null);
    setQuestion(null);
    
    console.log('🤖 STARTING AI QUESTION GENERATION');
    console.log('📋 Generation params:', { subject, skillArea, userId: user.id });
    
    try {
      console.log('🚀 Calling AI content generator directly...');
      
      const generatedContent = await aiContentGenerator.generateAdaptiveContent({
        subject,
        skillArea,
        difficultyLevel: 1,
        userId: user.id
      });

      console.log('✅ AI Content Generator returned:', generatedContent);

      if (!generatedContent || !generatedContent.question || !generatedContent.options) {
        throw new Error('Invalid AI content structure received');
      }

      const questionData: Question = {
        question: generatedContent.question,
        options: generatedContent.options,
        correct: generatedContent.correct,
        explanation: generatedContent.explanation,
        learningObjectives: generatedContent.learningObjectives || [],
        estimatedTime: generatedContent.estimatedTime || 30
      };

      console.log('🎯 Setting AI generated question:', questionData);
      setQuestion(questionData);

      toast({
        title: "AI Question Generated! 🤖",
        description: `Real AI question created for ${subject} - ${skillArea}`,
        duration: 3000
      });

    } catch (aiError) {
      console.error('💥 AI GENERATION FAILED:', aiError);
      console.error('💥 Error stack:', aiError.stack);
      
      setError(`AI generation failed: ${aiError.message}`);
      
      toast({
        title: "AI Generation Failed ❌",
        description: `Error: ${aiError.message}`,
        duration: 5000,
        variant: "destructive"
      });

    } finally {
      setIsLoading(false);
      isGenerating.current = false;
      console.log('🏁 AI generation process completed');
    }
  }, [user, subject, skillArea, toast]);

  return {
    question,
    isLoading,
    error,
    generateQuestion
  };
};
