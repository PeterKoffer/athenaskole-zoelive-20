
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useSubjectSpecificQuestions } from './hooks/useSubjectSpecificQuestions';
import QuestionHeader from './question/QuestionHeader';
import QuestionLoadingState from './question/QuestionLoadingState';
import QuestionErrorState from './question/QuestionErrorState';
import AnswerOptions from './AnswerOptions';
import QuestionResult from './QuestionResult';
import TextWithSpeaker from './shared/TextWithSpeaker';

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
          console.log('✅ Initial question generated:', question.content.question.substring(0, 50) + '...');
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
    
    console.log('📝 Answer selected:', answerIndex, 'Correct:', correct);
  }, [currentQuestion, hasAnswered]);

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
  }, [generateQuestion, usedQuestionIds, difficultyLevel, questionAttempts]);

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
      <TextWithSpeaker
        text={currentQuestion.content.question}
        context="question-content"
        position="corner"
        showOnHover={false}
      >
        <QuestionHeader
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          timeSpent={timeSpent}
          question={currentQuestion.content.question}
        />
      </TextWithSpeaker>

      {!showResult ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <AnswerOptions
              options={currentQuestion.content.options}
              selectedAnswer={selectedAnswer}
              correctAnswer={currentQuestion.content.correctAnswer}
              showResult={false}
              onAnswerSelect={handleAnswerSelect}
              disabled={hasAnswered}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <AnswerOptions
                options={currentQuestion.content.options}
                selectedAnswer={selectedAnswer}
                correctAnswer={currentQuestion.content.correctAnswer}
                showResult={true}
                onAnswerSelect={handleAnswerSelect}
                disabled={true}
              />
            </CardContent>
          </Card>
          
          <TextWithSpeaker
            text={currentQuestion.content.explanation || "Good work!"}
            context="question-explanation"
            position="corner"
            showOnHover={false}
          >
            <QuestionResult
              showResult={showResult}
              isCorrect={isCorrect}
              explanation={currentQuestion.content.explanation || "Good work!"}
              isLastQuestion={questionNumber >= totalQuestions}
            />
          </TextWithSpeaker>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleTryAgain}
              variant="outline"
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Try Another Question
            </Button>
            <Button
              onClick={handleContinue}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedQuestionActivity;
