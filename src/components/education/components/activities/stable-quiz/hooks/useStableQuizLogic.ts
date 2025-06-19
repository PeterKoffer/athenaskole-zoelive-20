
import { useState, useEffect, useMemo } from 'react';
import { LessonActivity } from '../../../types/LessonTypes';

interface UseStableQuizLogicProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

export const useStableQuizLogic = ({ activity, onActivityComplete }: UseStableQuizLogicProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Extract stable content once and never re-compute
  const stableContent = useMemo(() => {
    console.log('🔒 Creating STABLE content object for activity:', activity.id);
    
    if (!activity.content?.question || !activity.content?.options) {
      return null;
    }

    const optionsArray = Array.from(activity.content.options);

    return {
      question: activity.content.question,
      options: optionsArray,
      correctAnswer: activity.content.correctAnswer,
      explanation: activity.content.explanation,
      battleScenario: activity.content.battleScenario,
      title: activity.title,
      activityId: activity.id
    };
  }, [activity.id]);

  // Reset state when activity changes
  useEffect(() => {
    console.log('🔄 Resetting quiz state for new activity:', activity.id);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
    setScore(0);
    setHasCompleted(false);
  }, [activity.id]);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !showResult && stableContent && !hasCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && stableContent && !hasCompleted) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, stableContent, hasCompleted]);

  const handleTimeUp = () => {
    if (hasCompleted) return;
    
    console.log('⏰ Time up! Auto-completing activity');
    setShowResult(true);
    setScore(0);
    setHasCompleted(true);
    
    setTimeout(() => {
      console.log('🚀 Auto-advancing after time up');
      onActivityComplete(false);
    }, 3000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult && stableContent && !hasCompleted) {
      console.log('📝 Answer selected:', answerIndex);
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !stableContent || hasCompleted) return;
    
    console.log('✅ Submitting answer:', selectedAnswer, 'Correct:', stableContent.correctAnswer);
    setShowResult(true);
    setHasCompleted(true);
    
    const isCorrect = selectedAnswer === stableContent.correctAnswer;
    const earnedScore = isCorrect ? timeLeft * 10 : 0;
    setScore(earnedScore);
    
    // Ensure we only call completion once
    setTimeout(() => {
      console.log('🚀 Activity completed, advancing:', isCorrect);
      onActivityComplete(isCorrect);
    }, 3000);
  };

  return {
    stableContent,
    selectedAnswer,
    showResult,
    timeLeft,
    score,
    handleAnswerSelect,
    handleSubmit
  };
};
