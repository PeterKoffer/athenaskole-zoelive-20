
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSimpleQuestionGeneration } from './hooks/useSimpleQuestionGeneration';
import { LessonActivity } from './types/LessonTypes';
import QuestionHeader from './question/QuestionHeader';
import QuestionAnswerOptions from './question/QuestionAnswerOptions';
import QuestionResult from './question/QuestionResult';
import QuestionControls from './question/QuestionControls';
import QuestionLoadingState from './question/QuestionLoadingState';
import QuestionErrorState from './question/QuestionErrorState';

interface OptimizedQuestionActivityProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onComplete: (success: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

const OptimizedQuestionActivity = ({
  subject,
  skillArea,
  difficultyLevel,
  onComplete,
  questionNumber,
  totalQuestions
}: OptimizedQuestionActivityProps) => {
  const { user } = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<LessonActivity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { generateUniqueQuestion } = useSimpleQuestionGeneration({
    subject,
    skillArea
  });

  // Timer for question
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate question on mount
  useEffect(() => {
    if (!currentQuestion && !isLoading) {
      generateQuestion();
    }
  }, [currentQuestion, isLoading]);

  const generateQuestion = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newQuestion = generateUniqueQuestion();
      setCurrentQuestion(newQuestion);
    } catch (err) {
      console.error('Error generating question:', err);
      setError('Failed to generate question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === currentQuestion?.content?.correctAnswer;
    onComplete(isCorrect);
  };

  if (isLoading) {
    return <QuestionLoadingState />;
  }

  if (error) {
    return <QuestionErrorState error={error} onRetry={generateQuestion} />;
  }

  if (!currentQuestion) {
    return (
      <QuestionErrorState 
        error="Unable to load question content." 
        onRetry={generateQuestion} 
      />
    );
  }

  const isLastQuestion = questionNumber === totalQuestions;

  return (
    <div className="space-y-6">
      <QuestionHeader
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        timeSpent={timeSpent}
        question={currentQuestion.content?.question || ''}
      />

      <QuestionAnswerOptions
        options={currentQuestion.content?.options || []}
        selectedAnswer={selectedAnswer}
        correctAnswer={currentQuestion.content?.correctAnswer || 0}
        showResult={showResult}
        onAnswerSelect={handleAnswerSelect}
      />

      <QuestionResult
        selectedAnswer={selectedAnswer || 0}
        correctAnswer={currentQuestion.content?.correctAnswer || 0}
        explanation={currentQuestion.content?.explanation}
        showResult={showResult}
      />

      <QuestionControls
        selectedAnswer={selectedAnswer}
        showResult={showResult}
        isLastQuestion={isLastQuestion}
        onSubmitAnswer={handleSubmitAnswer}
        onNextQuestion={handleNextQuestion}
      />
    </div>
  );
};

export default OptimizedQuestionActivity;
