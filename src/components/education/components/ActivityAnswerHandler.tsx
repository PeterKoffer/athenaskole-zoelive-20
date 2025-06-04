
import { useCallback } from 'react';

interface ActivityAnswerHandlerProps {
  currentActivity: any;
  showResult: boolean;
  activityCompleted: boolean;
  score: number;
  onScoreUpdate: (newScore: number) => void;
  onActivityComplete: () => void;
  setSelectedAnswer: (answer: number) => void;
  setShowResult: (show: boolean) => void;
  setActivityCompleted: (completed: boolean) => void;
  stopSpeaking: () => void;
  speakText: (text: string) => void;
}

export const useActivityAnswerHandler = ({
  currentActivity,
  showResult,
  activityCompleted,
  score,
  onScoreUpdate,
  onActivityComplete,
  setSelectedAnswer,
  setShowResult,
  setActivityCompleted,
  stopSpeaking,
  speakText
}: ActivityAnswerHandlerProps) => {
  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (showResult || activityCompleted || currentActivity.type !== 'question') {
      console.log('🚫 Answer selection blocked:', { showResult, activityCompleted, type: currentActivity.type });
      return;
    }

    console.log('🎯 Answer selected:', answerIndex);
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setActivityCompleted(true);

    const isCorrect = answerIndex === currentActivity.content.correct;
    if (isCorrect) {
      onScoreUpdate(score + 1);
    }

    const feedback = isCorrect 
      ? `Excellent! ${currentActivity.content.explanation}` 
      : `Not quite right. ${currentActivity.content.explanation}`;
    
    stopSpeaking();
    setTimeout(() => {
      speakText(feedback);
    }, 500);

    setTimeout(() => {
      onActivityComplete();
    }, 4000);
  }, [showResult, activityCompleted, currentActivity, stopSpeaking, speakText, onActivityComplete, score, onScoreUpdate, setSelectedAnswer, setShowResult, setActivityCompleted]);

  const handleManualContinue = useCallback(() => {
    if (currentActivity.type === 'explanation' || currentActivity.type === 'game') {
      setActivityCompleted(true);
      onActivityComplete();
    }
  }, [currentActivity.type, onActivityComplete, setActivityCompleted]);

  return {
    handleAnswerSelect,
    handleManualContinue
  };
};
