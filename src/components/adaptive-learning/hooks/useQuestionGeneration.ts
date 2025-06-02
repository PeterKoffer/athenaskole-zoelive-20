
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { openaiContentService } from '@/services/openaiContentService';
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
  const [isLoading, setIsLoading] = useState(true);

  const generateQuestion = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log('🎯 Generating AI question for:', { subject, skillArea });
      
      const content = await openaiContentService.getOrGenerateContent(
        subject,
        skillArea,
        1, // Start with difficulty level 1
        user.id
      );

      console.log('📝 Generated content:', content);

      if (content && content.content) {
        const parsedContent = typeof content.content === 'string' 
          ? JSON.parse(content.content) 
          : content.content;

        const questionData: Question = {
          question: parsedContent.question || content.title || 'Sample question',
          options: parsedContent.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: parsedContent.correct || 0,
          explanation: parsedContent.explanation || 'This is the correct answer.',
          learningObjectives: content.learning_objectives || [],
          estimatedTime: content.estimated_time || 30
        };

        setQuestion(questionData);
      } else {
        // Fallback question if AI generation fails
        const fallbackQuestion: Question = {
          question: `What is a key concept in ${skillArea} for ${subject}?`,
          options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
          correct: 0,
          explanation: 'This is a sample explanation.',
          learningObjectives: [`Understanding ${skillArea} in ${subject}`],
          estimatedTime: 30
        };
        setQuestion(fallbackQuestion);
      }
    } catch (error) {
      console.error('❌ Error generating question:', error);
      toast({
        title: "Error",
        description: "Failed to generate question. Using sample content.",
        variant: "destructive"
      });

      // Use fallback question
      const fallbackQuestion: Question = {
        question: `Sample question for ${subject} - ${skillArea}`,
        options: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        correct: 0,
        explanation: 'This is a sample question for demonstration.',
        learningObjectives: [`Learning ${skillArea}`],
        estimatedTime: 30
      };
      setQuestion(fallbackQuestion);
    } finally {
      setIsLoading(false);
    }
  }, [user, subject, skillArea, toast]);

  return {
    question,
    isLoading,
    generateQuestion
  };
};
