
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives: string[];
  estimatedTime: number;
}

interface UseQuestionGenerationProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
}

export const useQuestionGeneration = ({ subject, skillArea, difficultyLevel, userId }: UseQuestionGenerationProps) => {
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = useCallback(async (previousQuestions: string[] = []) => {
    console.log('🚀 generateQuestion called');
    console.log('👤 User ID:', userId);
    console.log('📋 Params:', { subject, skillArea, difficultyLevel, historyCount: previousQuestions.length });

    if (!userId) {
      console.log('❌ No user found');
      setError('User not authenticated');
      return null;
    }

    console.log('🔥 Starting AI question generation');
    
    setIsGenerating(true);
    setError(null);
    setQuestion(null);
    
    try {
      console.log('📞 Calling Supabase edge function...');
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-adaptive-content', {
        body: {
          subject,
          skillArea,
          difficultyLevel,
          userId,
          previousQuestions
        }
      });

      console.log('📨 Function response:', { data, error: functionError });

      if (functionError) {
        console.error('❌ Function error:', functionError);
        throw new Error(`Function error: ${functionError.message}`);
      }

      if (!data) {
        console.error('❌ No data returned');
        throw new Error('No data returned from function');
      }

      if (!data.success) {
        console.error('❌ Function returned error:', data.error);
        console.error('❌ Debug info:', data.debug);
        throw new Error(data.error || 'Unknown error from AI generation');
      }

      if (!data.generatedContent) {
        console.error('❌ No generated content');
        throw new Error('No generated content in response');
      }

      const content = data.generatedContent;
      console.log('✅ Generated content received:', content);

      // Validate content structure
      if (!content.question || !Array.isArray(content.options) || typeof content.correct !== 'number') {
        console.error('❌ Invalid content structure:', content);
        throw new Error('Invalid content structure received');
      }

      const questionData: Question = {
        question: content.question,
        options: content.options,
        correct: content.correct,
        explanation: content.explanation || 'No explanation provided',
        learningObjectives: content.learningObjectives || [],
        estimatedTime: content.estimatedTime || 30
      };

      console.log('🎯 Final question data:', questionData);
      setQuestion(questionData);

      toast({
        title: "AI Question Generated! 🤖",
        description: `Real AI question created for ${subject} - ${skillArea}`,
        duration: 3000
      });

      console.log('✅ Question generation completed successfully');
      return questionData;

    } catch (error: any) {
      console.error('💥 Question generation failed:', error);
      
      const errorMessage = error.message || 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "AI Generation Failed ❌",
        description: errorMessage.length > 100 ? 'Check console for details' : errorMessage,
        duration: 8000,
        variant: "destructive"
      });

      return null;

    } finally {
      setIsGenerating(false);
      console.log('🏁 Generation process completed');
    }
  }, [userId, subject, skillArea, difficultyLevel, toast]);

  return {
    question,
    isGenerating,
    error,
    generateQuestion
  };
};
