
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubjectSpecificQuestions } from './hooks/useSubjectSpecificQuestions';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import QuestionLoadingState from './question/QuestionLoadingState';
import QuestionErrorState from './question/QuestionErrorState';
import QuestionActivityHeader from './question/QuestionActivityHeader';
import QuestionActivityContent from './question/QuestionActivityContent';
import QuestionActivityResult from './question/QuestionActivityResult';
import QuestionActivityControls from './question/QuestionActivityControls';

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
  const { user } = useAuth();
  const { playCorrectAnswerSound, playWrongAnswerSound } = useSoundEffects();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [questionAttempts, setQuestionAttempts] = useState(0);
  
  const startTime = useState(() => Date.now())[0];

  // Track time spent on question
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const { generateQuestion, isGeneratingQuestion } = useSubjectSpecificQuestions({
    subject,
    skillArea,
    usedQuestionIds,
    onQuestionUsed: (questionId: string) => {
      setUsedQuestionIds(prev => [...prev, questionId]);
    }
  });

  // Generate initial question with better variation
  useEffect(() => {
    const initializeQuestion = async () => {
      if (!currentQuestion && !isGeneratingQuestion) {
        console.log('🎯 Generating initial question for OptimizedQuestionActivity');
        
        const question = await generateQuestion();
        
        if (question) {
          setCurrentQuestion(question);
          console.log('✅ Initial question generated:', question.content.question?.substring(0, 50) + '...' || 'Question generated');
        }
      }
    };

    initializeQuestion();
  }, [currentQuestion, generateQuestion, isGeneratingQuestion, questionNumber, difficultyLevel, usedQuestionIds]);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (hasAnswered || !currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.content.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    setHasAnswered(true);
    
    // Play sound effects with proper timing
    setTimeout(() => {
      if (correct) {
        console.log('🎵 Playing correct answer sound effect');
        playCorrectAnswerSound();
      } else {
        console.log('🎵 Playing wrong answer sound effect');
        playWrongAnswerSound();
      }
    }, 100); // Small delay to ensure UI updates first
    
    console.log('📝 Answer selected:', answerIndex, 'Correct:', correct);
  }, [currentQuestion, hasAnswered, playCorrectAnswerSound, playWrongAnswerSound]);

  const handleContinue = useCallback(() => {
    console.log('➡️ Continuing to next activity, was correct:', isCorrect);
    onComplete(isCorrect);
  }, [isCorrect, onComplete]);

  const handleTryAgain = useCallback(async () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setHasAnswered(false);
    setQuestionAttempts(prev => prev + 1);
    
    // Generate a new question
    const newQuestion = await generateQuestion();
    
    if (newQuestion) {
      setCurrentQuestion(newQuestion);
    }
  }, [generateQuestion]);

  if (isGeneratingQuestion || !currentQuestion) {
    return <QuestionLoadingState />;
  }

  if (!user) {
    return (
      <QuestionErrorState 
        error="Authentication required"
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <QuestionActivityHeader
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        timeSpent={timeSpent}
        question={currentQuestion.content.question}
      />

      {!showResult ? (
        <QuestionActivityContent
          options={currentQuestion.content.options}
          selectedAnswer={selectedAnswer}
          correctAnswer={currentQuestion.content.correctAnswer}
          showResult={false}
          onAnswerSelect={handleAnswerSelect}
          disabled={hasAnswered}
        />
      ) : (
        <div className="space-y-4">
          <QuestionActivityContent
            options={currentQuestion.content.options}
            selectedAnswer={selectedAnswer}
            correctAnswer={currentQuestion.content.correctAnswer}
            showResult={true}
            onAnswerSelect={handleAnswerSelect}
            disabled={true}
          />
          
          <QuestionActivityResult
            showResult={showResult}
            isCorrect={isCorrect}
            explanation={currentQuestion.content.explanation || "Good work!"}
            isLastQuestion={questionNumber >= totalQuestions}
          />
          
          <QuestionActivityControls
            onTryAgain={handleTryAgain}
            onContinue={handleContinue}
          />
        </div>
      )}
    </div>
  );
};

export default OptimizedQuestionActivity;
