
import { useState, useCallback } from 'react';
import { useSubjectSpecificQuestions } from './useSubjectSpecificQuestions';
import { useFreshSessionManager } from './useFreshSessionManager';

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
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  const { generateQuestion, isGeneratingQuestion, clearSessionQuestions } = useSubjectSpecificQuestions({
    subject,
    skillArea,
    usedQuestionIds,
    onQuestionUsed
  });

  // Handle fresh session - clear all previous questions and generate new ones
  const handleNewSession = useCallback(() => {
    console.log('🆕 NEW SESSION DETECTED - Clearing all questions and generating fresh content');
    setDynamicActivities([]);
    setQuestionsGenerated(0);
    clearSessionQuestions();
  }, [clearSessionQuestions]);

  const { markNewSession } = useFreshSessionManager({
    onNewSession: handleNewSession
  });

  const generateDynamicActivity = useCallback(async () => {
    console.log(`🎯 Generating fresh activity for ${subject} (Session: ${sessionId})`);
    
    const newQuestion = await generateQuestion();
    
    if (newQuestion) {
      setQuestionsGenerated(prev => prev + 1);
      console.log(`✅ Generated FRESH ${subject} activity #${questionsGenerated + 1}:`, {
        id: newQuestion.id,
        question: newQuestion.content.question?.substring(0, 50) + '...',
        sessionId
      });
      return newQuestion;
    }
    
    console.warn('⚠️ Failed to generate fresh activity');
    return null;
  }, [generateQuestion, subject, sessionId, questionsGenerated]);

  const forceFreshSession = useCallback(() => {
    console.log('🔄 FORCING FRESH SESSION - User requested new content');
    markNewSession();
  }, [markNewSession]);

  return {
    dynamicActivities,
    setDynamicActivities,
    questionsGenerated,
    isGeneratingQuestion,
    generateDynamicActivity,
    forceFreshSession,
    sessionId
  };
};
