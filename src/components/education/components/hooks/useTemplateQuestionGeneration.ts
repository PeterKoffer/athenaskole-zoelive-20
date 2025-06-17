
import { useState, useCallback } from 'react';
import { questionTemplateSystem, GeneratedQuestion } from '@/services/questionTemplateSystem';

interface UseTemplateQuestionGenerationProps {
  subject: string;
  skillArea: string; 
  sessionId: string;
  difficultyLevel?: number;
}

export const useTemplateQuestionGeneration = ({
  subject,
  skillArea,
  sessionId,
  difficultyLevel = 1
}: UseTemplateQuestionGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionsGenerated, setQuestionsGenerated] = useState(0);

  const generateTemplateQuestion = useCallback((): GeneratedQuestion => {
    setIsGenerating(true);
    
    try {
      console.log(`🎯 Template generation for ${subject} class session: ${sessionId}`);
      
      const question = questionTemplateSystem.generateUniqueQuestion(
        subject,
        skillArea,
        sessionId,
        difficultyLevel
      );
      
      setQuestionsGenerated(prev => prev + 1);
      
      console.log(`✅ Template question ${questionsGenerated + 1} generated:`, {
        id: question.id,
        templateId: question.templateId,
        question: question.question.substring(0, 50) + '...'
      });
      
      return question;
      
    } finally {
      setIsGenerating(false);
    }
  }, [subject, skillArea, sessionId, difficultyLevel, questionsGenerated]);

  const clearTemplateSession = useCallback(() => {
    questionTemplateSystem.clearSession(sessionId);
    setQuestionsGenerated(0);
    console.log(`🧹 Cleared template session: ${sessionId}`);
  }, [sessionId]);

  const getTemplateStats = useCallback(() => {
    return questionTemplateSystem.getStats();
  }, []);

  return {
    generateTemplateQuestion,
    clearTemplateSession,
    getTemplateStats,
    isGenerating,
    questionsGenerated
  };
};
