
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
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

export const useQuestionGeneration = (subject: string, skillArea: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = useCallback(async () => {
    if (!user) {
      console.log('❌ No user found');
      setError('User not authenticated');
      return;
    }

    console.log('🚀 STARTING REAL AI QUESTION GENERATION');
    console.log('📋 Params:', { subject, skillArea, userId: user.id });
    
    setIsLoading(true);
    setError(null);
    setQuestion(null);
    
    try {
      console.log('📞 Calling Supabase edge function...');
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-adaptive-content', {
        body: {
          subject,
          skillArea,
          difficultyLevel: 1,
          userId: user.id
        }
      });

      console.log('📨 Edge function response:', { data, error: functionError });

      if (functionError) {
        console.error('❌ Supabase function error:', functionError);
        throw new Error(`Function error: ${functionError.message}`);
      }

      if (!data) {
        console.error('❌ No data returned from function');
        throw new Error('No data returned from function');
      }

      console.log('🔍 Function response data:', JSON.stringify(data, null, 2));

      if (!data.success) {
        console.error('❌ Function returned error:', data.error);
        console.error('❌ Debug info:', data.debug);
        
        let errorMessage = data.error || 'Unknown error from AI generation';
        if (data.debug) {
          errorMessage += `\n\nDebug info: ${JSON.stringify(data.debug, null, 2)}`;
        }
        
        throw new Error(errorMessage);
      }

      if (!data.generatedContent) {
        console.error('❌ No generated content in response');
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

      console.log('🎯 Setting question data:', questionData);
      setQuestion(questionData);

      toast({
        title: "AI Question Generated! 🤖",
        description: `Real AI question created for ${subject} - ${skillArea}`,
        duration: 3000
      });

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

    } finally {
      setIsLoading(false);
      console.log('🏁 Question generation process completed');
    }
  }, [user, subject, skillArea, toast]);

  return {
    question,
    isLoading,
    error,
    generateQuestion
  };
};
