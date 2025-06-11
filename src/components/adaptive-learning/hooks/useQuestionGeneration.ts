
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
  isRecap?: boolean; // Flag to allow repeated questions for recap/review
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
    const startTime = Date.now();
    console.log('🚀 Starting question generation at:', new Date().toISOString());
    console.log('👤 User ID:', userId);
    console.log('📋 Parameters:', { subject, skillArea, difficultyLevel, historyCount: previousQuestions.length });

    if (!userId) {
      console.log('❌ No user found');
      setError('User not authenticated');
      return null;
    }

    setIsGenerating(true);
    setError(null);
    setQuestion(null);
    
    try {
      console.log('📞 Calling Supabase edge function at:', new Date().toISOString());
      
      // Add a timeout to the function call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000);
      });

      const functionPromise = supabase.functions.invoke('generate-adaptive-content', {
        body: {
          subject,
          skillArea,
          difficultyLevel,
          userId,
          previousQuestions
        }
      });

      const { data, error: functionError } = await Promise.race([
        functionPromise,
        timeoutPromise
      ]) as any;

      const responseTime = Date.now() - startTime;
      console.log(`⏱️ Function response received in ${responseTime}ms`);
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
      console.log(`✅ Total generation time: ${Date.now() - startTime}ms`);
      setQuestion(questionData);

      toast({
        title: "AI Question Generated! 🤖",
        description: `Question created in ${Math.round(responseTime / 1000)}s`,
        duration: 3000
      });

      return questionData;

    } catch (error: any) {
      const totalTime = Date.now() - startTime;
      console.error(`💥 Question generation failed after ${totalTime}ms:`, error);
      
      const errorMessage = error.message || 'Unknown error occurred';
      setError(errorMessage);
      
      // Show different error messages based on the type of error
      if (error.message?.includes('timeout')) {
        toast({
          title: "Generation Timeout ⏱️",
          description: "AI is taking too long. Will use fallback question.",
          duration: 5000,
          variant: "destructive"
        });
      } else {
        toast({
          title: "AI Generation Failed ❌",
          description: errorMessage.length > 100 ? 'Check console for details' : errorMessage,
          duration: 8000,
          variant: "destructive"
        });
      }

      return null;

    } finally {
      setIsGenerating(false);
      const finalTime = Date.now() - startTime;
      console.log(`🏁 Generation process completed in ${finalTime}ms`);
    }
  }, [userId, subject, skillArea, difficultyLevel, toast]);

  return {
    question,
    isGenerating,
    error,
    generateQuestion
  };
};
