
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuestionGeneration } from './hooks/useQuestionGeneration';
import { useQuestionTimer } from './hooks/useQuestionTimer';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import QuestionHeader from './components/QuestionHeader';
import QuestionDisplay from './components/QuestionDisplay';
import QuestionResult from './components/QuestionResult';

interface AILearningModuleProps {
  subject: string;
  skillArea: string;
  onComplete: (score: number) => void;
}

const AILearningModule = ({ subject, skillArea, onComplete }: AILearningModuleProps) => {
  const { question, isLoading, generateQuestion } = useQuestionGeneration(subject, skillArea);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleTimeUp = () => {
    if (!showResult) {
      handleSubmit();
    }
  };

  const { timeLeft, startTime, startTimer, stopTimer } = useQuestionTimer(30, handleTimeUp);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  useEffect(() => {
    if (question && !showResult) {
      startTimer(question.estimatedTime);
    }
  }, [question, showResult, startTimer]);

  const handleAnswerSelect = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (!question || !startTime) return;

    const responseTime = (new Date().getTime() - startTime.getTime()) / 1000;
    const isCorrect = selectedAnswer === question.correct;
    const score = isCorrect ? 100 : 0;

    setShowResult(true);
    stopTimer();

    // Calculate final score based on accuracy and time
    let finalScore = score;
    if (isCorrect && responseTime < question.estimatedTime * 0.5) {
      finalScore = Math.min(100, score + 10); // Bonus for quick correct answers
    }

    setTimeout(() => {
      onComplete(finalScore);
    }, 3000); // Show result for 3 seconds before completing
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!question) {
    return <ErrorState onRetry={generateQuestion} />;
  }

  const isCorrect = selectedAnswer === question.correct;

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <QuestionHeader timeLeft={timeLeft} estimatedTime={question.estimatedTime} />
        <CardContent>
          <QuestionDisplay
            question={question}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
            onAnswerSelect={handleAnswerSelect}
            onSubmit={handleSubmit}
          />
          
          {showResult && (
            <QuestionResult
              question={question}
              selectedAnswer={selectedAnswer}
              isCorrect={isCorrect}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AILearningModule;
