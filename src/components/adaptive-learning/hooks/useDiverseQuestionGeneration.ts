
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Question, UseDiverseQuestionGenerationProps } from './types';
import { QuestionHistoryService } from './questionHistoryService';
import { globalQuestionUniquenessService } from '@/services/globalQuestionUniquenessService';

export { type Question } from './types';

interface QuestionContext extends Record<string, unknown> {
  previousQuestions?: string[];
  topicFocus?: string;
  conceptualArea?: string;
  bloomLevel?: number;
}

export const useDiverseQuestionGeneration = ({ 
  subject, 
  skillArea, 
  difficultyLevel, 
  userId,
  gradeLevel,
  standardsAlignment
}: UseDiverseQuestionGenerationProps) => {
  const { toast } = useToast();
  
  // State for backward compatibility
  const [sessionQuestions, setSessionQuestions] = useState<string[]>([]);
  const [questionTopics, setQuestionTopics] = useState<Set<string>>(new Set());
  const [generationAttempts, setGenerationAttempts] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDiverseQuestion = useCallback(async (questionContext?: QuestionContext): Promise<Question> => {
    setGenerationAttempts(prev => prev + 1);
    setIsGenerating(true);
    
    try {
      console.log(`🎯 Generating UNIQUE ${subject} question #${generationAttempts + 1} for Grade ${gradeLevel}`);
      console.log(`📊 Current stats: ${sessionQuestions.length} session questions, ${questionTopics.size} topics covered`);

      // Generate unique question ID
      const questionId = globalQuestionUniquenessService.generateUniqueQuestion(userId, {
        subject,
        skillArea,
        difficultyLevel,
        questionContext
      });
      
      // Create mock question
      const legacyQuestion: Question = {
        id: questionId,
        question: `What is the result of this ${subject} problem at difficulty level ${difficultyLevel}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct: Math.floor(Math.random() * 4),
        explanation: `This is the explanation for the ${subject} question.`,
        learningObjectives: [`Learn ${skillArea} concepts`],
        estimatedTime: 30,
        conceptsCovered: [skillArea]
      };

      // Update session tracking
      setSessionQuestions(prev => [...prev, legacyQuestion.question]);
      const questionTopic = legacyQuestion.question.split(' ').slice(0, 5).join(' ');
      setQuestionTopics(prev => new Set([...prev, questionTopic]));

      console.log('✅ UNIQUE question generated successfully:', legacyQuestion.question.substring(0, 50) + '...');
      console.log(`📊 Question ID: ${questionId}`);
      
      return legacyQuestion;

    } catch (error) {
      console.error('❌ Question generation failed:', error);
      
      toast({
        title: "Question Generation Failed",
        description: "Unable to generate a unique question. Please try again.",
        variant: "destructive",
        duration: 3000
      });

      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [subject, skillArea, gradeLevel, sessionQuestions.length, questionTopics.size, generationAttempts, userId, difficultyLevel, toast]);

  const saveQuestionHistory = useCallback(async (
    question: Question, 
    userAnswer: number, 
    isCorrect: boolean, 
    responseTime: number,
    additionalContext?: any
  ) => {
    try {
      await QuestionHistoryService.saveQuestionHistory(
        userId,
        subject,
        skillArea,
        difficultyLevel,
        question,
        userAnswer,
        isCorrect,
        responseTime,
        {
          ...additionalContext,
          sessionQuestions: sessionQuestions.length,
          topicsCovered: questionTopics.size
        }
      );
    } catch (error) {
      console.error('Failed to save question history:', error);
    }
  }, [userId, subject, skillArea, difficultyLevel, sessionQuestions.length, questionTopics.size]);

  return {
    isGenerating,
    generateDiverseQuestion,
    saveQuestionHistory,
    // Additional stats for monitoring
    generationStats: {
      sessionQuestions: sessionQuestions.length,
      topicsCovered: questionTopics.size,
      generationAttempts
    }
  };
};
