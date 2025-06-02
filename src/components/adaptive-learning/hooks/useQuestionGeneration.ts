
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
      console.log('❌ No user found, cannot generate question');
      setError('User not authenticated');
      return;
    }

    if (isGenerating.current) {
      console.log('⏳ Already generating, skipping...');
      return;
    }

    isGenerating.current = true;
    setIsLoading(true);
    setError(null);
    setQuestion(null);
    
    console.log('🎯 Starting AI question generation for:', { subject, skillArea, userId: user.id });
    
    try {
      console.log('🚀 Calling AI content generator...');
      
      const generatedContent = await aiContentGenerator.generateAdaptiveContent({
        subject,
        skillArea,
        difficultyLevel: 1,
        userId: user.id
      });

      console.log('📝 AI Generated content received:', generatedContent);

      // Validate the generated content
      if (!generatedContent || !generatedContent.question || !generatedContent.options) {
        throw new Error('Invalid content structure received from AI');
      }

      const questionData: Question = {
        question: generatedContent.question,
        options: generatedContent.options,
        correct: generatedContent.correct,
        explanation: generatedContent.explanation,
        learningObjectives: generatedContent.learningObjectives || [],
        estimatedTime: generatedContent.estimatedTime || 30
      };

      setQuestion(questionData);
      console.log('✅ AI Question set successfully:', questionData);

      toast({
        title: "New AI Question Generated! 🤖",
        description: "AI has created a personalized question for you",
        duration: 3000
      });

    } catch (aiError) {
      console.error('❌ AI generation failed completely:', aiError);
      console.error('❌ Full error details:', {
        message: aiError.message,
        stack: aiError.stack,
        name: aiError.name
      });
      
      // Set the actual error message instead of using fallback
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
    }
  }, [user, subject, skillArea, toast]);

  return {
    question,
    isLoading,
    error,
    generateQuestion
  };
};
