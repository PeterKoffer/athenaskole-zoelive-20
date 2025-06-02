
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
    
    console.log('🎯 Starting question generation for:', { subject, skillArea, userId: user.id });
    
    try {
      const generatedContent = await aiContentGenerator.generateAdaptiveContent({
        subject,
        skillArea,
        difficultyLevel: 1,
        userId: user.id
      });

      console.log('📝 Generated content received:', generatedContent);

      // Validate the generated content
      if (!generatedContent || !generatedContent.question || !generatedContent.options) {
        throw new Error('Invalid content structure received');
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
      console.log('✅ Question set successfully:', questionData);

      toast({
        title: "New Question Generated! 🎯",
        description: "AI has created a personalized question for you",
        duration: 3000
      });

    } catch (error) {
      console.error('❌ Error generating question:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate question');
      
      // Create a working fallback question
      const fallbackQuestion: Question = {
        question: `What is an important concept in ${skillArea} for ${subject}?`,
        options: [
          `Basic ${skillArea} understanding`,
          `Advanced ${skillArea} knowledge`,
          `Applied ${skillArea} skills`, 
          `Theoretical ${skillArea} framework`
        ],
        correct: 0,
        explanation: `Understanding basic concepts in ${skillArea} is fundamental for ${subject} learning.`,
        learningObjectives: [`Learn ${skillArea} fundamentals`],
        estimatedTime: 30
      };
      
      setQuestion(fallbackQuestion);
      console.log('🔄 Using fallback question:', fallbackQuestion);

      toast({
        title: "Question Ready! 📚",
        description: "Practice question loaded (using fallback)",
        duration: 3000
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
