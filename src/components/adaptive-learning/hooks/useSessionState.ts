
import { useState, useCallback } from 'react';
import { Question, UserAnswer, SessionProgress } from '../types/learningTypes';

interface SessionState {
  currentQuestionIndex: number;
  questions: Question[];
  answers: UserAnswer[];
  isComplete: boolean;
  score: number;
  progress: SessionProgress;
  timeSpent: number;
  streak: number;
  hintsUsed: number;
  masteryLevel: number;
  difficultyAdjustments: number;
  skillAreas: string[];
}

const initialState: SessionState = {
  currentQuestionIndex: 0,
  questions: [],
  answers: [],
  isComplete: false,
  score: 0,
  progress: {
    completed: 0,
    total: 0,
    percentage: 0
  },
  timeSpent: 0,
  streak: 0,
  hintsUsed: 0,
  masteryLevel: 0,
  difficultyAdjustments: 0,
  skillAreas: []
};

export const useSessionState = () => {
  const [state, setState] = useState<SessionState>(initialState);

  const updateQuestions = useCallback((questions: Question[]) => {
    setState(prev => ({
      ...prev,
      questions,
      progress: {
        ...prev.progress,
        total: questions.length
      }
    }));
  }, []);

  const submitAnswer = useCallback((answer: UserAnswer) => {
    setState(prev => ({
      ...prev,
      answers: [...prev.answers, answer],
      score: answer.isCorrect ? prev.score + 1 : prev.score,
      streak: answer.isCorrect ? prev.streak + 1 : 0,
      progress: {
        completed: prev.answers.length + 1,
        total: prev.questions.length,
        percentage: ((prev.answers.length + 1) / prev.questions.length) * 100
      }
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      isComplete: prev.currentQuestionIndex + 1 >= prev.questions.length
    }));
  }, []);

  const resetSession = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    updateQuestions,
    submitAnswer,
    nextQuestion,
    resetSession
  };
};
