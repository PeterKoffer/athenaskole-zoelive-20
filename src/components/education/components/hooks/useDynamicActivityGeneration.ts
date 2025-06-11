
import { useState, useCallback } from 'react';
import { useSubjectSpecificQuestions } from './useSubjectSpecificQuestions';

interface UseDynamicActivityGenerationProps {
  subject: string;
  skillArea: string;
  timeElapsed: number;
  usedQuestionIds?: string[];
  onQuestionUsed?: (questionId: string) => void;
}

export const useDynamicActivityGeneration = ({
  subject,
  skillArea,
  timeElapsed,
  usedQuestionIds = [],
  onQuestionUsed = () => {}
}: UseDynamicActivityGenerationProps) => {
  const [dynamicActivities, setDynamicActivities] = useState<any[]>([]);
  const [questionsGenerated, setQuestionsGenerated] = useState(0);

  const { generateQuestion, isGeneratingQuestion } = useSubjectSpecificQuestions({
    subject,
    skillArea,
    usedQuestionIds,
    onQuestionUsed
  });

  const generateDynamicActivity = useCallback(async () => {
    console.log('🎯 Starting dynamic activity generation for:', subject);
    
    const newQuestion = await generateQuestion();
    
    if (newQuestion) {
      setQuestionsGenerated(prev => prev + 1);
      console.log('✅ Generated dynamic activity:', newQuestion.content.question.substring(0, 50) + '...');
      return newQuestion;
    }
    
    console.warn('⚠️ Failed to generate dynamic activity');
    return null;
  }, [generateQuestion, subject]);

  return {
    dynamicActivities,
    setDynamicActivities,
    questionsGenerated,
    isGeneratingQuestion,
    generateDynamicActivity
  };
};
