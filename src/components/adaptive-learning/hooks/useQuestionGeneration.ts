
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
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);

  const generateQuestion = useCallback(async () => {
    console.log('🚀 useQuestionGeneration.generateQuestion() CALLED');
    console.log('👤 User check:', { hasUser: !!user, userId: user?.id });
    console.log('📋 Generation params:', { subject, skillArea, historyCount: questionHistory.length });

    if (!user) {
      console.log('❌ No user found - cannot generate question');
      setError('User not authenticated');
      return;
    }

    console.log('🔥 STARTING REAL AI QUESTION GENERATION PROCESS');
    
    setIsLoading(true);
    setError(null);
    setQuestion(null);
    
    try {
      console.log('📞 About to call Supabase edge function...');
      console.log('📋 Function call params:', {
        functionName: 'generate-adaptive-content',
        body: {
          subject,
          skillArea,
          difficultyLevel: 1,
          userId: user.id,
          previousQuestions: questionHistory
        }
      });
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-adaptive-content', {
        body: {
          subject,
          skillArea,
          difficultyLevel: 1,
          userId: user.id,
          previousQuestions: questionHistory
        }
      });

      console.log('📨 Supabase function response received:');
      console.log('  - data:', data);
      console.log('  - error:', functionError);

      if (functionError) {
        console.error('❌ Supabase function error:', functionError);
        throw new Error(`Function error: ${functionError.message}`);
      }

      if (!data) {
        console.error('❌ No data returned from function');
        throw new Error('No data returned from function');
      }

      console.log('🔍 Function response analysis:');
      console.log('  - data keys:', Object.keys(data));
      console.log('  - success:', data.success);
      console.log('  - error:', data.error);
      console.log('  - generatedContent:', !!data.generatedContent);

      if (!data.success) {
        console.error('❌ Function returned error:', data.error);
        console.error('❌ Debug info:', data.debug);
        
        let errorMessage = data.error || 'Unknown error from AI generation';
        if (data.debug) {
          console.log('🔍 Full debug info:', JSON.stringify(data.debug, null, 2));
        }
        
        throw new Error(errorMessage);
      }

      if (!data.generatedContent) {
        console.error('❌ No generated content in successful response');
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

      console.log('🎯 Final question data prepared:', questionData);
      setQuestion(questionData);

      // Add to question history to avoid repeats
      setQuestionHistory(prev => [...prev, content.question]);

      toast({
        title: "AI Question Generated! 🤖",
        description: `Real AI question created for ${subject} - ${skillArea}`,
        duration: 3000
      });

      console.log('✅ Question generation completed successfully');

    } catch (error: any) {
      console.error('💥 Question generation failed with error:', error);
      console.error('💥 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
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
      console.log('🏁 Question generation process completed (finally block)');
    }
  }, [user, subject, skillArea, toast, questionHistory]);

  return {
    question,
    isLoading,
    error,
    generateQuestion
  };
};
