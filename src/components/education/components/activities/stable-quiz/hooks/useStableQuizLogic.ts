
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
    let timer: NodeJS.Timeout | undefined;
    if (timeLeft > 0 && !showResult && stableContent && !hasCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResult && stableContent && !hasCompleted) {
      // handleTimeUp is called, which itself calls onActivityComplete after a timeout
      // No direct call to handleTimeUp here to avoid it being a dependency that might change.
      // The condition itself will trigger handleTimeUp if not already called by other means.
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, showResult, stableContent, hasCompleted]); // Removed handleTimeUp from deps

  // Add at the top of the hook
  const [logicTimeoutId, setLogicTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount or when activity.id changes
  useEffect(() => {
    return () => {
      if (logicTimeoutId) {
        clearTimeout(logicTimeoutId);
        console.log('🧹 Cleared pending logic timeout in useStableQuizLogic for activity:', activity.id);
      }
    };
  }, [logicTimeoutId, activity.id]);

  const handleTimeUp = () => {
    if (hasCompleted) return;
    
    console.log('⏰ Time up! Auto-completing activity');
    setShowResult(true);
    setScore(0); // Or some other logic for time up
    setHasCompleted(true);
    
    // if (logicTimeoutId) clearTimeout(logicTimeoutId); // Keep timeout logic
    // const newTimeoutId = setTimeout(() => {
    //   console.log('🚀 Auto-advancing after time up');
    //   onActivityComplete(false);
    // }, 3000);
    // setLogicTimeoutId(newTimeoutId);
    onActivityComplete(false); // Call synchronously for debugging
  };

  // Call handleTimeUp if timeLeft reaches 0 and not handled yet
  useEffect(() => {
    if (timeLeft === 0 && !showResult && stableContent && !hasCompleted) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, stableContent, hasCompleted, handleTimeUp]);


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
    // if (logicTimeoutId) clearTimeout(logicTimeoutId); // Keep timeout logic
    // const newTimeoutId = setTimeout(() => {
    //   console.log('🚀 Activity completed, advancing:', isCorrect);
    //   onActivityComplete(isCorrect);
    // }, 3000);
    // setLogicTimeoutId(newTimeoutId);
    onActivityComplete(isCorrect); // Call synchronously for debugging
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
