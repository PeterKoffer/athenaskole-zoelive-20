
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Question, UseDiverseQuestionGenerationProps, QuestionContext } from './types';
import { QuestionGenerationService } from './questionGenerationService';
import { QuestionHistoryService } from './questionHistoryService';
import { FallbackQuestionGenerator } from './fallbackQuestionGenerator';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<string[]>([]);

  const generateDiverseQuestion = useCallback(async (questionContext?: QuestionContext): Promise<Question> => {
    setIsGenerating(true);
    
    try {
      // Get recent questions from database to avoid duplicates
      const recentQuestions = await QuestionHistoryService.getRecentQuestions(userId, subject, skillArea);
      const usedQuestions = [...recentQuestions, ...sessionQuestions];

      console.log(`🎯 Generating diverse ${subject} question for Grade ${gradeLevel}, avoiding ${usedQuestions.length} used questions`);

      // Set a shorter timeout for question generation
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Question generation timeout')), 8000); // 8 second timeout
      });

      // Try to generate question using API with timeout
      const questionPromise = QuestionGenerationService.generateWithAPI(
        subject,
        skillArea,
        difficultyLevel,
        userId,
        gradeLevel,
        standardsAlignment,
        questionContext,
        usedQuestions
      );

      let question;
      try {
        question = await Promise.race([questionPromise, timeoutPromise]);
      } catch (apiError) {
        console.log('⚠️ API generation failed or timed out, using fallback:', apiError.message);
        
        // Use fallback immediately if API fails
        const uniqueQuestion = FallbackQuestionGenerator.createUniqueQuestion(
          subject, 
          skillArea, 
          Date.now(), 
          usedQuestions.length + Math.random() * 1000
        );
        setSessionQuestions(prev => [...prev, uniqueQuestion.question]);
        
        toast({
          title: "Question Ready! 📚",
          description: `Created Grade ${gradeLevel} practice question`,
          duration: 2000
        });

        return uniqueQuestion;
      }

      // Check for duplicates
      if (QuestionGenerationService.isDuplicateQuestion(question.question, usedQuestions)) {
        console.log('⚠️ Generated question is too similar, creating completely new one...');
        const uniqueQuestion = FallbackQuestionGenerator.createUniqueQuestion(
          subject, 
          skillArea, 
          Date.now(), 
          usedQuestions.length + Math.random() * 1000
        );
        setSessionQuestions(prev => [...prev, uniqueQuestion.question]);
        return uniqueQuestion;
      }

      console.log('✅ Generated unique question:', question.question);
      
      // Add to session cache
      setSessionQuestions(prev => [...prev, question.question]);

      toast({
        title: "New Question Generated! 🎯",
        description: `Grade ${gradeLevel} content created just for you`,
        duration: 2000
      });

      return question;

    } catch (error) {
      console.error('Question generation failed:', error);
      
      // Enhanced fallback with guaranteed uniqueness
      const uniqueQuestion = FallbackQuestionGenerator.createUniqueQuestion(
        subject, 
        skillArea, 
        Date.now(), 
        Math.random() * 1000
      );
      setSessionQuestions(prev => [...prev, uniqueQuestion.question]);
      
      toast({
        title: "Question Ready",
        description: `Created unique Grade ${gradeLevel} practice question`,
        duration: 2000
      });

      return uniqueQuestion;
    } finally {
      setIsGenerating(false);
    }
  }, [subject, skillArea, difficultyLevel, userId, gradeLevel, standardsAlignment, sessionQuestions, toast]);

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
        additionalContext
      );
    } catch (error) {
      console.error('Failed to save question history:', error);
      // Continue without breaking the flow
    }
  }, [userId, subject, skillArea, difficultyLevel]);

  return {
    isGenerating,
    generateDiverseQuestion,
    saveQuestionHistory
  };
};
