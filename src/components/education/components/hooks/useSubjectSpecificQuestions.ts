
import { useState, useCallback } from 'react';
import { useUnifiedQuestionGeneration } from '@/hooks/useUnifiedQuestionGeneration';
import { useAuth } from '@/hooks/useAuth';

interface UseSubjectSpecificQuestionsProps {
  subject: string;
  skillArea: string;
  usedQuestionIds: string[];
  onQuestionUsed: (questionId: string) => void;
}

export const useSubjectSpecificQuestions = ({
  subject,
  skillArea,
  usedQuestionIds,
  onQuestionUsed
}: UseSubjectSpecificQuestionsProps) => {
  const { user } = useAuth();
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);

  // Use the unified question generation system
  const {
    generateUniqueQuestion,
    isGenerating: isUnifiedGenerating,
    currentQuestion
  } = useUnifiedQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel: 3,
    userId: user?.id || 'anonymous',
    gradeLevel: 5,
    maxAttempts: 5,
    enablePersistence: true
  });

  const generateQuestion = useCallback(async () => {
    if (isGeneratingQuestion || isUnifiedGenerating) {
      console.log('🚫 Question generation already in progress');
      return null;
    }

    setIsGeneratingQuestion(true);
    console.log('🎯 Generating NEW unique question...', { 
      subject, 
      skillArea, 
      excludeCount: usedQuestionIds.length 
    });

    try {
      // Add timestamp and random context to force uniqueness
      const uniqueContext = {
        timestamp: Date.now(),
        sessionId: Math.random().toString(36).substring(7),
        avoidQuestions: usedQuestionIds,
        forceUniqueContent: true,
        diversityLevel: 'maximum'
      };

      const uniqueQuestion = await generateUniqueQuestion(uniqueContext);
      
      if (!uniqueQuestion) {
        console.warn('⚠️ No unique question generated');
        return null;
      }

      // Convert to lesson activity format
      const dynamicQuestion = {
        id: `dynamic-${subject}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        title: `${subject} Practice Question`,
        phase: 'interactive-game' as const,
        duration: 60,
        content: {
          question: uniqueQuestion.question,
          options: uniqueQuestion.options,
          correctAnswer: uniqueQuestion.correctAnswer,
          explanation: uniqueQuestion.explanation || 'Great job working through this problem!'
        }
      };
      
      // Mark this question as used
      onQuestionUsed(dynamicQuestion.id);
      
      console.log('✅ Generated NEW unique question:', {
        id: dynamicQuestion.id,
        question: uniqueQuestion.question.substring(0, 50) + '...',
        options: uniqueQuestion.options.length
      });
      
      return dynamicQuestion;
      
    } catch (error) {
      console.error('❌ Error generating unique question:', error);
      
      // Create a truly unique fallback question with timestamp
      const timestamp = new Date().toISOString();
      const randomNum1 = Math.floor(Math.random() * 50) + 10;
      const randomNum2 = Math.floor(Math.random() * 30) + 5;
      
      const fallbackQuestion = {
        id: `fallback-${subject}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        title: `${subject} Practice Question`,
        phase: 'interactive-game' as const,
        duration: 60,
        content: {
          question: `At the enchanted library on ${new Date().toLocaleDateString()}, wizard Alex found ${randomNum1} magical books. If ${randomNum2} more books appeared, how many books are there in total?`,
          options: [
            `${randomNum1 + randomNum2}`,
            `${randomNum1 + randomNum2 + 5}`,
            `${randomNum1 + randomNum2 - 3}`,
            `${randomNum1 - randomNum2}`
          ],
          correctAnswer: 0,
          explanation: `Alex had ${randomNum1} books and ${randomNum2} more appeared. So ${randomNum1} + ${randomNum2} = ${randomNum1 + randomNum2} books in total.`
        }
      };
      
      onQuestionUsed(fallbackQuestion.id);
      console.log('✅ Generated unique fallback question with timestamp:', fallbackQuestion.id);
      return fallbackQuestion;
    } finally {
      setIsGeneratingQuestion(false);
    }
  }, [
    subject, 
    skillArea, 
    usedQuestionIds, 
    onQuestionUsed, 
    isGeneratingQuestion, 
    isUnifiedGenerating,
    generateUniqueQuestion
  ]);

  return {
    generateQuestion,
    isGeneratingQuestion: isGeneratingQuestion || isUnifiedGenerating
  };
};
