
import { useState } from 'react';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LessonState {
  phase: 'introduction' | 'interactive' | 'paused' | 'completed';
  timeSpent: number;
  currentSegment: number;
  totalSegments: number;
  canResume: boolean;
}

export const useInteractiveLessonState = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [hasReadQuestion, setHasReadQuestion] = useState(false);

  const resetForNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setHasReadQuestion(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = (currentQuestion: Question) => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    return isCorrect;
  };

  const moveToNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    resetForNextQuestion();
  };

  return {
    currentQuestionIndex,
    selectedAnswer,
    showResult,
    score,
    hasReadQuestion,
    setHasReadQuestion,
    handleAnswerSelect,
    handleSubmitAnswer,
    moveToNextQuestion,
    resetForNextQuestion
  };
};
