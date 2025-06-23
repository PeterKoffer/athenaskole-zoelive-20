
import { useState, useCallback } from 'react';
import { stableQuestionTemplateSystem, PrecompiledQuestion } from '@/services/stableQuestionTemplateSystem';

interface UseStableQuestionGenerationProps {
  subject: string;
  skillArea: string;
}

export const useStableQuestionGeneration = ({
  subject,
  skillArea
}: UseStableQuestionGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionsGenerated, setQuestionsGenerated] = useState(0);
  
  // Create a unique session ID that persists for this hook instance
  const [sessionId] = useState(() => 
    `stable_${subject}_${skillArea}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  );

  const generateStableQuestion = useCallback((): PrecompiledQuestion => {
    setIsGenerating(true);
    
    try {
      console.log(`🎯 Stable generation for ${subject} (session: ${sessionId})`);
      
      const question = stableQuestionTemplateSystem.getStableQuestion(
        subject,
        skillArea,
        sessionId,
        1 // difficulty level
      );
      
      if (!question) {
        throw new Error('No stable question available');
      }
      
      setQuestionsGenerated(prev => prev + 1);
      
      console.log(`✅ Stable question ${questionsGenerated + 1} retrieved:`, {
        id: question.id,
        templateId: question.templateId,
        question: question.question.substring(0, 50) + '...'
      });
      
      return question;
      
    } finally {
      setIsGenerating(false);
    }
  }, [subject, skillArea, sessionId, questionsGenerated]);

  const clearStableSession = useCallback(() => {
    stableQuestionTemplateSystem.clearSession(sessionId);
    setQuestionsGenerated(0);
    console.log(`🧹 Cleared stable session: ${sessionId}`);
  }, [sessionId]);

  const getStableStats = useCallback(() => {
    return stableQuestionTemplateSystem.getStats();
  }, []);

  return {
    generateStableQuestion,
    clearStableSession,
    getStableStats,
    isGenerating,
    questionsGenerated,
    sessionId
  };
};
