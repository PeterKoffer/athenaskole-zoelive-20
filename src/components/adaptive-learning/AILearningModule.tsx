
import { useState, useEffect, useRef } from 'react';
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
  const { question, isLoading, error, generateQuestion } = useQuestionGeneration(subject, skillArea);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const hasInitialized = useRef(false);

  console.log('🔄 AILearningModule state:', { 
    subject, 
    skillArea, 
    hasQuestion: !!question, 
    isLoading, 
    error,
    hasInitialized: hasInitialized.current 
  });

  const handleTimeUp = () => {
    if (!showResult) {
      handleSubmit();
    }
  };

  const { timeLeft, startTimer, stopTimer } = useQuestionTimer(30, handleTimeUp);

  // Force AI generation on mount - only once
  useEffect(() => {
    if (!hasInitialized.current) {
      console.log('🚀 AILearningModule: FORCING AI question generation for:', { subject, skillArea });
      hasInitialized.current = true;
      generateQuestion();
    }
  }, [generateQuestion, subject, skillArea]);

  useEffect(() => {
    if (question && !showResult && !startTime) {
      console.log('⏰ Starting timer for AI question:', question.estimatedTime);
      setStartTime(new Date());
      startTimer(question.estimatedTime);
    }
  }, [question, showResult, startTime, startTimer]);

  const handleAnswerSelect = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
      console.log('📝 Answer selected for AI question:', index);
    }
  };

  const handleSubmit = () => {
    if (!question || !startTime) {
      console.log('❌ Cannot submit: missing question or start time');
      return;
    }

    const responseTime = (new Date().getTime() - startTime.getTime()) / 1000;
    const isCorrect = selectedAnswer === question.correct;
    const score = isCorrect ? 100 : 0;

    console.log('✅ Submitting AI answer:', { selectedAnswer, correct: question.correct, isCorrect, score, responseTime });

    setShowResult(true);
    stopTimer();

    // Calculate final score based on accuracy and time
    let finalScore = score;
    if (isCorrect && responseTime < question.estimatedTime * 0.5) {
      finalScore = Math.min(100, score + 10);
    }

    setTimeout(() => {
      console.log('🎯 AI module completing with final score:', finalScore);
      onComplete(finalScore);
    }, 3000);
  };

  const handleRetry = () => {
    console.log('🔄 Retrying AI question generation...');
    setSelectedAnswer(null);
    setShowResult(false);
    setStartTime(null);
    hasInitialized.current = false; // Reset to allow re-initialization
    generateQuestion();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    console.error('❌ AILearningModule error state:', error);
    return <ErrorState onRetry={handleRetry} />;
  }

  if (!question) {
    console.log('❌ No question available, showing error state');
    return <ErrorState onRetry={handleRetry} />;
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
