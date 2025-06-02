
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuestionGeneration } from './hooks/useQuestionGeneration';
import { useQuestionTimer } from './hooks/useQuestionTimer';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import QuestionHeader from './components/QuestionHeader';
import QuestionDisplay from './components/QuestionDisplay';
import QuestionResult from './components/QuestionResult';
import LessonComplete from './components/LessonComplete';

interface AILearningModuleProps {
  subject: string;
  skillArea: string;
  onComplete: (score: number) => void;
}

const AILearningModule = ({ subject, skillArea, onComplete }: AILearningModuleProps) => {
  console.log('🎯 AILearningModule MOUNTED with:', { subject, skillArea });
  
  const { question, isLoading, error, generateQuestion } = useQuestionGeneration(subject, skillArea);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [totalQuestions] = useState(5); // Set lesson to 5 questions
  const [lessonScore, setLessonScore] = useState(0);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  console.log('🔄 AILearningModule render state:', { 
    subject, 
    skillArea, 
    hasQuestion: !!question, 
    isLoading, 
    hasError: !!error,
    currentQuestionNumber,
    totalQuestions,
    lessonScore,
    isLessonComplete
  });

  const handleTimeUp = () => {
    if (!showResult && selectedAnswer === null) {
      handleAnswerSubmit();
    }
  };

  const { timeLeft, startTimer, stopTimer } = useQuestionTimer(30, handleTimeUp);

  // Generate first question on mount
  useEffect(() => {
    console.log('🚀 AILearningModule: Starting lesson - generating first question');
    generateQuestion();
  }, [generateQuestion]);

  // Start timer when question is received
  useEffect(() => {
    if (question && !showResult && !startTime) {
      console.log('⏰ Starting timer for question', currentQuestionNumber);
      setStartTime(new Date());
      startTimer(question.estimatedTime);
    }
  }, [question, showResult, startTime, startTimer, currentQuestionNumber]);

  const handleAnswerSelect = (index: number) => {
    if (!showResult && !selectedAnswer) {
      console.log('📝 Answer selected:', index, 'for question', currentQuestionNumber);
      setSelectedAnswer(index);
      // Auto-submit immediately when answer is selected
      setTimeout(() => handleAnswerSubmit(index), 500); // Small delay for visual feedback
    }
  };

  const handleAnswerSubmit = (answerIndex?: number) => {
    const finalAnswer = answerIndex !== undefined ? answerIndex : selectedAnswer;
    
    if (!question || !startTime) {
      console.log('❌ Cannot submit: missing question or start time');
      return;
    }

    const responseTime = (new Date().getTime() - startTime.getTime()) / 1000;
    const isCorrect = finalAnswer === question.correct;
    
    console.log('✅ Submitting answer for question', currentQuestionNumber, ':', { 
      selectedAnswer: finalAnswer, 
      correct: question.correct, 
      isCorrect, 
      responseTime 
    });

    // Update lesson score
    if (isCorrect) {
      setLessonScore(prev => prev + 1);
    }

    setShowResult(true);
    stopTimer();

    // Move to next question or complete lesson after showing result
    setTimeout(() => {
      if (currentQuestionNumber < totalQuestions) {
        moveToNextQuestion();
      } else {
        completeLessonFlow();
      }
    }, 2000); // Show result for 2 seconds
  };

  const moveToNextQuestion = () => {
    console.log('➡️ Moving to next question:', currentQuestionNumber + 1);
    setCurrentQuestionNumber(prev => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setStartTime(null);
    generateQuestion();
  };

  const completeLessonFlow = () => {
    console.log('🎯 Lesson completed! Final score:', lessonScore, '/', totalQuestions);
    setIsLessonComplete(true);
    
    // Calculate percentage score
    const percentageScore = Math.round((lessonScore / totalQuestions) * 100);
    
    setTimeout(() => {
      onComplete(percentageScore);
    }, 3000);
  };

  const handleRetry = () => {
    console.log('🔄 AILearningModule: Retrying question generation...');
    setSelectedAnswer(null);
    setShowResult(false);
    setStartTime(null);
    generateQuestion();
  };

  if (isLessonComplete) {
    return <LessonComplete 
      score={lessonScore} 
      totalQuestions={totalQuestions} 
      onContinue={() => onComplete(Math.round((lessonScore / totalQuestions) * 100))}
    />;
  }

  if (isLoading) {
    console.log('⏳ AILearningModule: Showing loading state for question', currentQuestionNumber);
    return <LoadingState />;
  }

  if (error) {
    console.error('❌ AILearningModule: Error state:', error);
    return <ErrorState onRetry={handleRetry} />;
  }

  if (!question) {
    console.log('❌ AILearningModule: No question available');
    return <ErrorState onRetry={handleRetry} />;
  }

  const isCorrect = selectedAnswer === question.correct;

  console.log('✅ AILearningModule: Rendering question', currentQuestionNumber, 'interface');

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <QuestionHeader 
          timeLeft={timeLeft} 
          estimatedTime={question.estimatedTime}
          currentQuestion={currentQuestionNumber}
          totalQuestions={totalQuestions}
          score={lessonScore}
        />
        <CardContent>
          <QuestionDisplay
            question={question}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
            onAnswerSelect={handleAnswerSelect}
            autoSubmit={true}
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
