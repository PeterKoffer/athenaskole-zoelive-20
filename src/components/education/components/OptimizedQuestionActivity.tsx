
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReliableQuestionGeneration } from '../adaptive-learning/hooks/useReliableQuestionGeneration';
import QuestionHeader from './question/QuestionHeader';
import QuestionAnswerOptions from './question/QuestionAnswerOptions';
import QuestionResult from './question/QuestionResult';
import QuestionLoadingState from './question/QuestionLoadingState';
import QuestionErrorState from './question/QuestionErrorState';

interface OptimizedQuestionActivityProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onComplete: (wasCorrect?: boolean) => void;
  questionNumber?: number;
  totalQuestions?: number;
}

const OptimizedQuestionActivity = ({
  subject,
  skillArea,
  difficultyLevel,
  onComplete,
  questionNumber = 1,
  totalQuestions = 6
}: OptimizedQuestionActivityProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  
  const startTime = useState(() => Date.now())[0];

  // Track time spent on question
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const {
    currentQuestion,
    isLoading,
    error,
    generateNewQuestion,
    hasQuestions
  } = useReliableQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel,
    autoGenerate: true
  });

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion?.correct;
    setIsCorrect(correct);
    setShowResult(true);
    setHasAnswered(true);
    
    console.log('📝 Answer selected:', answerIndex, 'Correct:', correct);
  }, [currentQuestion?.correct, hasAnswered]);

  const handleContinue = useCallback(() => {
    console.log('➡️ Continuing to next activity, was correct:', isCorrect);
    onComplete(isCorrect);
  }, [isCorrect, onComplete]);

  const handleTryAgain = useCallback(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setHasAnswered(false);
    generateNewQuestion();
  }, [generateNewQuestion]);

  if (isLoading || !hasQuestions) {
    return <QuestionLoadingState />;
  }

  if (error || !currentQuestion) {
    return (
      <QuestionErrorState 
        error={error}
        onRetry={generateNewQuestion}
      />
    );
  }

  return (
    <div className="space-y-6">
      <QuestionHeader
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        timeSpent={timeSpent}
        question={currentQuestion.question}
      />

      {!showResult ? (
        <QuestionAnswerOptions
          options={currentQuestion.options}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          disabled={hasAnswered}
        />
      ) : (
        <QuestionResult
          isCorrect={isCorrect}
          correctAnswer={currentQuestion.correct}
          options={currentQuestion.options}
          explanation={currentQuestion.explanation}
          onContinue={handleContinue}
          onTryAgain={handleTryAgain}
          timeSpent={timeSpent}
        />
      )}
    </div>
  );
};

export default OptimizedQuestionActivity;
