import React, { useEffect, useCallback } from 'react';
import { GameDefinition } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, CheckCircle, XCircle, Target } from 'lucide-react';

interface FastFactsState {
  currentProblem: MathProblem;
  score: number;
  streak: number;
  totalAttempts: number;
  correctAttempts: number;
  timeRemaining: number;
  gameStarted: boolean;
  gameFinished: boolean;
  problems: MathProblem[];
  currentProblemIndex: number;
  userAnswer: string;
  feedback: { correct: boolean; message: string } | null;
  meta: {
    accuracy: number;
    avgResponseTime: number;
    responseTimes: number[];
    problemStartTime: number;
  };
}

interface MathProblem {
  question: string;
  answer: number;
  operands: [number, number];
  operation: '+' | '-' | '×' | '÷';
}

function generateMathProblem(difficulty: number = 1): MathProblem {
  const operations = ['+', '-', '×', '÷'] as const;
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let a: number, b: number, answer: number;
  
  const range = Math.min(10 + difficulty * 5, 100);
  
  switch (operation) {
    case '+':
      a = Math.floor(Math.random() * range) + 1;
      b = Math.floor(Math.random() * range) + 1;
      answer = a + b;
      break;
    case '-':
      a = Math.floor(Math.random() * range) + 10;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
      break;
    case '×':
      a = Math.floor(Math.random() * Math.min(12, Math.max(5, difficulty * 2))) + 1;
      b = Math.floor(Math.random() * Math.min(12, Math.max(5, difficulty * 2))) + 1;
      answer = a * b;
      break;
    case '÷':
      answer = Math.floor(Math.random() * Math.min(12, Math.max(5, difficulty * 2))) + 1;
      b = Math.floor(Math.random() * Math.min(10, Math.max(2, difficulty))) + 1;
      a = answer * b;
      break;
  }
  
  return {
    question: `${a} ${operation} ${b} = ?`,
    answer,
    operands: [a, b],
    operation
  };
}

const FastFactsGame: GameDefinition<FastFactsState> = {
  id: 'fast-facts',
  title: 'Fast Facts Free Throws',
  subject: 'Mathematics',
  gradeBands: ['3-5', '6-8'],
  description: 'Race against time to solve math problems and score points!',
  estimatedTimeMs: 90000, // 90 seconds

  init(_seed: number, params: any = {}) {
    const difficulty = params.difficulty || 1;
    const timeLimit = params.timeLimit || 90; // 90 seconds default
    
    // Generate initial set of problems
    const problems = Array.from({ length: 50 }, () => generateMathProblem(difficulty));
    
    return {
      currentProblem: problems[0],
      score: 0,
      streak: 0,
      totalAttempts: 0,
      correctAttempts: 0,
      timeRemaining: timeLimit,
      gameStarted: false,
      gameFinished: false,
      problems,
      currentProblemIndex: 0,
      userAnswer: '',
      feedback: null,
      meta: {
        accuracy: 0,
        avgResponseTime: 0,
        responseTimes: [],
        problemStartTime: Date.now()
      }
    };
  },

  reducer(state: FastFactsState, action: any) {
    switch (action.type) {
      case 'START_GAME':
        return {
          ...state,
          gameStarted: true,
          meta: {
            ...state.meta,
            problemStartTime: Date.now()
          }
        };

      case 'TICK':
        if (!state.gameStarted || state.gameFinished) return state;
        
        const newTimeRemaining = Math.max(0, state.timeRemaining - 1);
        return {
          ...state,
          timeRemaining: newTimeRemaining,
          gameFinished: newTimeRemaining === 0
        };

      case 'UPDATE_ANSWER':
        return {
          ...state,
          userAnswer: action.payload
        };

      case 'SUBMIT_ANSWER':
        if (state.gameFinished) return state;
        
        const responseTime = Date.now() - state.meta.problemStartTime;
        const isCorrect = parseInt(state.userAnswer) === state.currentProblem.answer;
        const newStreak = isCorrect ? state.streak + 1 : 0;
        const points = isCorrect ? (1 + Math.floor(newStreak / 5)) : 0; // Bonus points for streaks
        
        const nextIndex = Math.min(state.currentProblemIndex + 1, state.problems.length - 1);
        
        return {
          ...state,
          score: state.score + points,
          streak: newStreak,
          totalAttempts: state.totalAttempts + 1,
          correctAttempts: state.correctAttempts + (isCorrect ? 1 : 0),
          currentProblemIndex: nextIndex,
          currentProblem: state.problems[nextIndex],
          userAnswer: '',
          feedback: {
            correct: isCorrect,
            message: isCorrect 
              ? `Correct! +${points} points ${newStreak >= 5 ? `(${newStreak} streak!)` : ''}` 
              : `Wrong. Answer was ${state.currentProblem.answer}`
          },
          meta: {
            ...state.meta,
            responseTimes: [...state.meta.responseTimes, responseTime],
            accuracy: (state.correctAttempts + (isCorrect ? 1 : 0)) / (state.totalAttempts + 1),
            avgResponseTime: [...state.meta.responseTimes, responseTime].reduce((a, b) => a + b, 0) / (state.meta.responseTimes.length + 1),
            problemStartTime: Date.now()
          }
        };

      case 'CLEAR_FEEDBACK':
        return {
          ...state,
          feedback: null
        };

      default:
        return state;
    }
  },

  score(state: FastFactsState) {
    return state.score;
  },

  isFinished(state: FastFactsState) {
    return state.gameFinished;
  },

  getProgress(state: FastFactsState) {
    if (!state.gameStarted) return 0;
    const totalTime = 90; // Default time limit
    return 1 - (state.timeRemaining / totalTime);
  },

  render(state: FastFactsState, dispatch: any) {
    // Timer effect
    useEffect(() => {
      if (!state.gameStarted || state.gameFinished) return;
      
      const timer = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
      
      return () => clearInterval(timer);
    }, [state.gameStarted, state.gameFinished]);

    // Clear feedback after delay
    useEffect(() => {
      if (state.feedback) {
        const timeout = setTimeout(() => {
          dispatch({ type: 'CLEAR_FEEDBACK' });
        }, 1500);
        return () => clearTimeout(timeout);
      }
    }, [state.feedback]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
      e.preventDefault();
      if (state.userAnswer.trim()) {
        dispatch({ type: 'SUBMIT_ANSWER' });
      }
    }, [state.userAnswer]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(e as any);
      }
    }, [handleSubmit]);

    if (!state.gameStarted) {
      return (
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center">🏀 Fast Facts Free Throws</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-lg">
              Score points by solving math problems quickly!
            </div>
            <div className="text-sm opacity-90">
              • Get bonus points for answer streaks<br />
              • 90 seconds on the clock<br />
              • Every correct answer is a score!
            </div>
            <Button 
              onClick={() => dispatch({ type: 'START_GAME' })}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Start Game
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (state.gameFinished) {
      return (
        <Card className="bg-gradient-to-br from-green-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center">🏆 Game Over!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold">{state.score} Points</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold">Accuracy</div>
                <div>{Math.round(state.meta.accuracy * 100)}%</div>
              </div>
              <div>
                <div className="font-semibold">Best Streak</div>
                <div>{state.streak}</div>
              </div>
              <div>
                <div className="font-semibold">Problems Solved</div>
                <div>{state.correctAttempts}/{state.totalAttempts}</div>
              </div>
              <div>
                <div className="font-semibold">Avg Time</div>
                <div>{Math.round(state.meta.avgResponseTime / 1000 * 10) / 10}s</div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {/* Game Header */}
        <Card className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  <span className="font-mono text-lg">{state.timeRemaining}s</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span className="font-bold">{state.score} pts</span>
                </div>
                {state.streak > 0 && (
                  <div className="bg-white/20 px-2 py-1 rounded">
                    🔥 {state.streak} streak
                  </div>
                )}
              </div>
              <div className="text-sm opacity-90">
                {state.correctAttempts}/{state.totalAttempts} correct
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problem */}
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-4xl font-bold mb-6 text-gray-800">
              {state.currentProblem.question}
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-xs mx-auto">
              <input
                type="number"
                value={state.userAnswer}
                onChange={(e) => dispatch({ type: 'UPDATE_ANSWER', payload: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full text-2xl text-center p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="?"
                autoFocus
              />
              <Button 
                type="submit" 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                disabled={!state.userAnswer.trim()}
              >
                Submit Answer
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Feedback */}
        {state.feedback && (
          <Card className={`${state.feedback.correct ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>
            <CardContent className="p-4 text-center">
              <div className={`flex items-center justify-center gap-2 ${state.feedback.correct ? 'text-green-700' : 'text-red-700'}`}>
                {state.feedback.correct ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <span className="font-semibold">{state.feedback.message}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
};

export default FastFactsGame;