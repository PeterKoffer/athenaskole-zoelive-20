
import { useState, useEffect, useCallback } from 'react';
import { useSpeechSynthesis } from '@/components/adaptive-learning/hooks/useSpeechSynthesis';
import ActivityExplanation from './ActivityExplanation';
import ActivityQuestion from './ActivityQuestion';
import ActivityGame from './ActivityGame';

interface LessonActivity {
  id: string;
  type: 'question' | 'game' | 'explanation' | 'practice';
  title: string;
  duration: number;
  content: any;
}

interface LessonActivityManagerProps {
  activities: LessonActivity[];
  currentActivityIndex: number;
  score: number;
  onActivityComplete: () => void;
  onScoreUpdate: (newScore: number) => void;
}

const LessonActivityManager = ({
  activities,
  currentActivityIndex,
  score,
  onActivityComplete,
  onScoreUpdate
}: LessonActivityManagerProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [activityCompleted, setActivityCompleted] = useState(false);

  const {
    autoReadEnabled,
    speakText,
    stopSpeaking
  } = useSpeechSynthesis();

  const currentActivity = activities[currentActivityIndex];

  // Reset states when activity changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setActivityCompleted(false);
  }, [currentActivityIndex]);

  // Speak activity content when it changes
  useEffect(() => {
    if (currentActivity && autoReadEnabled && !activityCompleted) {
      stopSpeaking();
      
      setTimeout(() => {
        if (currentActivity.type === 'explanation') {
          speakText(currentActivity.content.text);
        } else if (currentActivity.type === 'question') {
          const questionText = `${currentActivity.content.question}. Your options are: ${currentActivity.content.options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}: ${opt}`).join(', ')}`;
          speakText(questionText);
        } else if (currentActivity.type === 'game') {
          speakText(`Let's play a game! ${currentActivity.content.text}`);
        }
      }, 1000);
    }
  }, [currentActivityIndex, autoReadEnabled, activityCompleted, currentActivity, speakText, stopSpeaking]);

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
  }, [showResult, activityCompleted, currentActivity, stopSpeaking, speakText, onActivityComplete, score, onScoreUpdate]);

  const handleManualContinue = useCallback(() => {
    if (currentActivity.type === 'explanation' || currentActivity.type === 'game') {
      setActivityCompleted(true);
      onActivityComplete();
    }
  }, [currentActivity.type, onActivityComplete]);

  if (!currentActivity) {
    return null;
  }

  if (currentActivity.type === 'explanation') {
    return (
      <ActivityExplanation
        title={currentActivity.title}
        content={currentActivity.content}
        activityCompleted={activityCompleted}
        onContinue={handleManualContinue}
      />
    );
  }

  if (currentActivity.type === 'question') {
    return (
      <ActivityQuestion
        title={currentActivity.title}
        content={currentActivity.content}
        selectedAnswer={selectedAnswer}
        showResult={showResult}
        activityCompleted={activityCompleted}
        onAnswerSelect={handleAnswerSelect}
      />
    );
  }

  if (currentActivity.type === 'game') {
    return (
      <ActivityGame
        title={currentActivity.title}
        content={currentActivity.content}
        activityCompleted={activityCompleted}
        onContinue={handleManualContinue}
      />
    );
  }

  return null;
};

export default LessonActivityManager;
