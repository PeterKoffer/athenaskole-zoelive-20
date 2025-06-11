
import { useState, useCallback } from 'react';
import { useSimpleQuestionGeneration } from './useSimpleQuestionGeneration';

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
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  
  const { generateUniqueQuestion, questionCount } = useSimpleQuestionGeneration({
    subject,
    skillArea
  });

  const generateQuestion = useCallback(async () => {
    if (isGeneratingQuestion) {
      console.log('🚫 Question generation already in progress');
      return null;
    }

    setIsGeneratingQuestion(true);
    console.log('🎯 Generating truly unique question...', { 
      subject, 
      skillArea, 
      questionNumber: questionCount + 1
    });

    try {
      const uniqueQuestion = generateUniqueQuestion();
      
      // Track this question to prevent repetition
      onQuestionUsed(uniqueQuestion.id);
      
      console.log('✅ Generated unique question:', {
        id: uniqueQuestion.id,
        question: uniqueQuestion.content.question.substring(0, 50) + '...',
        options: uniqueQuestion.content.options.length,
        questionNumber: questionCount
      });
      
      return uniqueQuestion;
      
    } catch (error) {
      console.error('❌ Error generating unique question:', error);
      return null;
    } finally {
      setIsGeneratingQuestion(false);
    }
  }, [
    subject, 
    skillArea, 
    onQuestionUsed, 
    isGeneratingQuestion,
    generateUniqueQuestion,
    questionCount
  ]);

  return {
    generateQuestion,
    isGeneratingQuestion,
    sessionQuestionCount: questionCount
  };
};
