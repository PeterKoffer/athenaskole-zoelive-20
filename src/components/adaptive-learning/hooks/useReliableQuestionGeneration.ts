
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createFallbackQuestion } from '../utils/fallbackQuestions';

export interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives: string[];
  estimatedTime: number;
  conceptsCovered: string[];
}

interface UseReliableQuestionGenerationProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
}

export const useReliableQuestionGeneration = ({ 
  subject, 
  skillArea, 
  difficultyLevel, 
  userId 
}: UseReliableQuestionGenerationProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationAttempts, setGenerationAttempts] = useState(0);

  const getUsedQuestions = useCallback(async () => {
    try {
      const { data: history } = await supabase
        .from('user_question_history')
        .select('question_text')
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .order('asked_at', { ascending: false })
        .limit(50);

      return history?.map(h => h.question_text) || [];
    } catch (error) {
      console.warn('Could not fetch question history:', error);
      return [];
    }
  }, [userId, subject, skillArea]);

  const generateWithAI = useCallback(async (usedQuestions: string[]): Promise<Question | null> => {
    console.log('🤖 Attempting AI generation...');
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: {
          subject,
          skillArea,
          difficultyLevel,
          userId,
          previousQuestions: usedQuestions
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'AI generation failed');
      if (!data.generatedContent) throw new Error('No content generated');

      const content = data.generatedContent;
      
      // Validate structure
      if (!content.question || !Array.isArray(content.options) || typeof content.correct !== 'number') {
        throw new Error('Invalid content structure');
      }

      return {
        question: content.question,
        options: content.options,
        correct: content.correct,
        explanation: content.explanation || 'No explanation provided',
        learningObjectives: content.learningObjectives || [],
        estimatedTime: content.estimatedTime || 30,
        conceptsCovered: [skillArea]
      };

    } catch (error) {
      console.error('AI generation failed:', error);
      return null;
    }
  }, [subject, skillArea, difficultyLevel, userId]);

  const generateQuestion = useCallback(async (): Promise<Question> => {
    setIsGenerating(true);
    setGenerationAttempts(prev => prev + 1);

    try {
      const usedQuestions = await getUsedQuestions();
      console.log(`📝 Generation attempt ${generationAttempts + 1}, avoiding ${usedQuestions.length} used questions`);

      // Try AI generation first
      const aiQuestion = await generateWithAI(usedQuestions);
      
      if (aiQuestion && !usedQuestions.includes(aiQuestion.question)) {
        console.log('✅ AI question generated successfully');
        toast({
          title: "AI Question Generated! 🤖",
          description: "Fresh question created for your learning",
          duration: 2000
        });
        return aiQuestion;
      }

      // Fallback to pre-made questions
      console.log('🔄 Using fallback question');
      const fallbackQuestion = createFallbackQuestion();
      
      // Make fallback unique if needed
      if (usedQuestions.includes(fallbackQuestion.question)) {
        fallbackQuestion.question = `${fallbackQuestion.question} (Practice ${generationAttempts + 1})`;
      }

      toast({
        title: "Practice Question Ready",
        description: "Using backup question for continued learning",
        duration: 2000
      });

      return {
        ...fallbackQuestion,
        conceptsCovered: [skillArea]
      };

    } catch (error) {
      console.error('Question generation completely failed:', error);
      
      // Ultimate fallback
      return {
        question: `${subject} practice question ${Date.now()}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct: 0,
        explanation: 'This is a basic practice question.',
        learningObjectives: [skillArea],
        estimatedTime: 30,
        conceptsCovered: [skillArea]
      };
    } finally {
      setIsGenerating(false);
    }
  }, [getUsedQuestions, generateWithAI, generationAttempts, subject, skillArea, toast]);

  const saveQuestionHistory = useCallback(async (question: Question, userAnswer: number, isCorrect: boolean, responseTime: number) => {
    try {
      await supabase.from('user_question_history').insert({
        user_id: userId,
        subject,
        skill_area: skillArea,
        question_text: question.question,
        difficulty_level: difficultyLevel,
        concepts_covered: question.conceptsCovered,
        user_answer: userAnswer.toString(),
        correct_answer: question.correct.toString(),
        is_correct: isCorrect,
        response_time_seconds: Math.round(responseTime / 1000)
      });

      console.log('📚 Question history saved');
    } catch (error) {
      console.warn('Could not save question history:', error);
    }
  }, [userId, subject, skillArea, difficultyLevel]);

  return {
    isGenerating,
    generateQuestion,
    saveQuestionHistory,
    generationAttempts
  };
};
