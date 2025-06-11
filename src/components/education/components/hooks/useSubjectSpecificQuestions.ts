
import { useState, useCallback } from 'react';
import { SubjectQuestionService } from '@/services/subjectQuestionService';

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

  const generateQuestion = useCallback(async () => {
    if (isGeneratingQuestion) return null;

    setIsGeneratingQuestion(true);
    console.log('🎯 Generating subject-specific question...', { subject, skillArea, excludeCount: usedQuestionIds.length });

    try {
      const questionTemplate = await SubjectQuestionService.getRandomQuestionForSubject(
        subject,
        skillArea,
        usedQuestionIds
      );

      if (!questionTemplate) {
        console.warn('⚠️ No more unique questions available for:', { subject, skillArea });
        return null;
      }

      const dynamicQuestion = SubjectQuestionService.createDynamicQuestion(questionTemplate);
      
      // Mark this question as used
      onQuestionUsed(questionTemplate.id);
      
      console.log('✅ Generated question:', dynamicQuestion.content.question.substring(0, 50) + '...');
      return dynamicQuestion;
      
    } catch (error) {
      console.error('❌ Error generating subject question:', error);
      return null;
    } finally {
      setIsGeneratingQuestion(false);
    }
  }, [subject, skillArea, usedQuestionIds, onQuestionUsed, isGeneratingQuestion]);

  return {
    generateQuestion,
    isGeneratingQuestion
  };
};
