
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Question, UseDiverseQuestionGenerationProps, QuestionContext } from './types';
import { QuestionHistoryService } from './questionHistoryService';
import { useUnifiedQuestionGeneration } from '@/hooks/useUnifiedQuestionGeneration';
import { UniqueQuestion } from '@/services/globalQuestionUniquenessService';

export { type Question } from './types';

export const useDiverseQuestionGeneration = ({ 
  subject, 
  skillArea, 
  difficultyLevel, 
  userId,
  gradeLevel,
  standardsAlignment
}: UseDiverseQuestionGenerationProps) => {
  const { toast } = useToast();
  
  // Use the unified question generation system
  const {
    generateUniqueQuestion: generateUnified,
    saveQuestionHistory: saveUnified,
    isGenerating,
    currentQuestion,
    generationStats
  } = useUnifiedQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel,
    userId,
    gradeLevel,
    standardsAlignment,
    maxAttempts: 5,
    enablePersistence: true
  });

  // Legacy state for backward compatibility
  const [sessionQuestions, setSessionQuestions] = useState<string[]>([]);
  const [questionTopics, setQuestionTopics] = useState<Set<string>>(new Set());
  const [generationAttempts, setGenerationAttempts] = useState(0);

  // Update legacy state when new questions are generated
  useEffect(() => {
    if (currentQuestion) {
      setSessionQuestions(prev => {
        if (!prev.includes(currentQuestion.question)) {
          return [...prev, currentQuestion.question];
        }
        return prev;
      });
      
      // Extract topic from question for legacy compatibility
      const questionTopic = currentQuestion.question.split(' ').slice(0, 5).join(' ');
      setQuestionTopics(prev => new Set([...prev, questionTopic]));
    }
  }, [currentQuestion]);

  const generateDiverseQuestion = useCallback(async (questionContext?: QuestionContext): Promise<Question> => {
    setGenerationAttempts(prev => prev + 1);
    
    try {
      console.log(`🎯 Generating UNIQUE ${subject} question #${generationAttempts + 1} for Grade ${gradeLevel}`);
      console.log(`📊 Current stats: ${sessionQuestions.length} session questions, ${questionTopics.size} topics covered`);

      // Use the unified generation system
      const uniqueQuestion: UniqueQuestion = await generateUnified(questionContext);
      
      // Convert UniqueQuestion back to legacy Question format for compatibility
      const legacyQuestion: Question = {
        question: uniqueQuestion.question,
        options: uniqueQuestion.options,
        correct: uniqueQuestion.correct,
        explanation: uniqueQuestion.explanation,
        learningObjectives: uniqueQuestion.learningObjectives,
        estimatedTime: uniqueQuestion.estimatedTime,
        conceptsCovered: uniqueQuestion.conceptsCovered
      };

      console.log('✅ UNIQUE question generated successfully:', uniqueQuestion.question.substring(0, 50) + '...');
      console.log(`📊 Question ID: ${uniqueQuestion.id}`);
      
      return legacyQuestion;

    } catch (error) {
      console.error('❌ Unified question generation failed:', error);
      
      toast({
        title: "Question Generation Failed",
        description: "Unable to generate a unique question. Please try again.",
        variant: "destructive",
        duration: 3000
      });

      throw error;
    }
  }, [subject, skillArea, gradeLevel, sessionQuestions.length, questionTopics.size, generationAttempts, generateUnified, toast]);

  const saveQuestionHistory = useCallback(async (
    question: Question, 
    userAnswer: number, 
    isCorrect: boolean, 
    responseTime: number,
    additionalContext?: any
  ) => {
    try {
      // If we have a current unique question that matches, use the unified save
      if (currentQuestion && currentQuestion.question === question.question) {
        await saveUnified(
          currentQuestion,
          userAnswer,
          isCorrect,
          responseTime,
          {
            ...additionalContext,
            legacyCompatibility: true,
            sessionQuestions: sessionQuestions.length,
            topicsCovered: questionTopics.size
          }
        );
      } else {
        // Fallback to legacy save for backward compatibility
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
            legacyMode: true
          }
        );
      }
    } catch (error) {
      console.error('Failed to save question history:', error);
    }
  }, [userId, subject, skillArea, difficultyLevel, currentQuestion, saveUnified, sessionQuestions.length, questionTopics.size]);

  return {
    isGenerating,
    generateDiverseQuestion,
    saveQuestionHistory,
    // Additional stats for monitoring
    generationStats: {
      sessionQuestions: sessionQuestions.length,
      topicsCovered: questionTopics.size,
      generationAttempts,
      ...generationStats
    }
  };
};
