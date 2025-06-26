
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, Target, CheckCircle, XCircle, RotateCcw, Play, Pause } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuestionManager } from './components/QuestionManager';
import { useSessionLifecycle } from '@/hooks/useSessionLifecycle';
import { useSessionMetrics } from '@/hooks/useSessionMetrics';

export interface AdaptivePracticeModuleProps {
  subject?: string;
  skillArea?: string;
  difficultyLevel?: number;
  totalQuestions?: number;
  onComplete?: (score: number, metrics: any) => void;
  onBack?: () => void;
}

const AdaptivePracticeModule: React.FC<AdaptivePracticeModuleProps> = ({
  subject = 'mathematics',
  skillArea = 'general_mathematics',
  difficultyLevel = 2,
  totalQuestions = 5,
  onComplete,
  onBack
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const {
    currentSession,
    showResults,
    currentQuestionKey,
    initializeSession,
    completeSession,
    resetSession
  } = useSessionLifecycle();

  const {
    questionsCompleted,
    correctAnswers,
    totalResponseTime,
    sessionScore,
    updateMetrics,
    resetMetrics,
    calculateFinalScore
  } = useSessionMetrics();

  const {
    sessionQuestions,
    currentQuestionIndex,
    answers,
    isGenerating,
    generateNextQuestion,
    handleAnswerSelect,
    resetQuestions
  } = useQuestionManager({
    subject,
    skillArea,
    difficultyLevel,
    userId: user?.id || 'anonymous',
    totalQuestions
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentSession === 'active' && !isPaused && sessionStartTime) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentSession, isPaused, sessionStartTime]);

  // Initialize session when component mounts
  useEffect(() => {
    if (user && currentSession === 'loading') {
      initializeSession();
      setSessionStartTime(new Date());
    }
  }, [user, currentSession, initializeSession]);

  // Generate first question when session starts
  useEffect(() => {
    if (currentSession === 'active' && sessionQuestions.length === 0 && !isGenerating) {
      generateNextQuestion();
    }
  }, [currentSession, sessionQuestions.length, isGenerating, generateNextQuestion]);

  const handleAnswerSubmit = useCallback((selectedAnswer: number) => {
    const startTime = Date.now();
    const currentQuestion = sessionQuestions[currentQuestionIndex];
    
    if (!currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correct;
    const responseTime = Math.floor(Math.random() * 3000) + 2000; // Mock response time

    // Update metrics
    updateMetrics(isCorrect, responseTime);

    // Show feedback
    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect 
        ? "Great job! Keep it up!" 
        : `The correct answer was: ${currentQuestion.options[currentQuestion.correct]}`,
      variant: isCorrect ? "default" : "destructive",
      duration: 2000
    });

    // Handle answer selection with completion callback
    handleAnswerSelect(selectedAnswer, () => {
      if (currentQuestionIndex + 1 >= totalQuestions) {
        const finalScore = calculateFinalScore();
        completeSession();
        
        if (onComplete) {
          onComplete(finalScore, {
            questionsCompleted: questionsCompleted + 1,
            correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers,
            accuracy: finalScore,
            timeElapsed,
            averageResponseTime: totalResponseTime / (questionsCompleted + 1)
          });
        }
      }
    });
  }, [sessionQuestions, currentQuestionIndex, updateMetrics, toast, handleAnswerSelect, totalQuestions, calculateFinalScore, completeSession, onComplete, questionsCompleted, correctAnswers, timeElapsed, totalResponseTime]);

  const handleRestart = useCallback(() => {
    resetSession();
    resetMetrics();
    resetQuestions();
    setSessionStartTime(new Date());
    setTimeElapsed(0);
    setIsPaused(false);
  }, [resetSession, resetMetrics, resetQuestions]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = sessionQuestions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + (currentQuestion ? 1 : 0)) / totalQuestions) * 100;

  if (currentSession === 'loading') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-pulse" />
          <h3 className="text-xl font-semibold mb-2">Preparing Your Practice Session</h3>
          <p className="text-gray-600">Setting up adaptive learning for {subject}...</p>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const finalScore = calculateFinalScore();
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Target className="w-6 h-6 text-green-500" />
            Practice Session Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-6xl font-bold text-green-500">
            {finalScore}%
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{questionsCompleted}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{formatTime(timeElapsed)}</div>
              <div className="text-sm text-gray-600">Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {Math.round(totalResponseTime / questionsCompleted / 1000)}s
              </div>
              <div className="text-sm text-gray-600">Avg Time</div>
            </div>
          </div>

          <div className="space-y-2">
            <Badge variant={finalScore >= 80 ? "default" : finalScore >= 60 ? "secondary" : "destructive"}>
              {finalScore >= 80 ? "Excellent!" : finalScore >= 60 ? "Good Work!" : "Keep Practicing!"}
            </Badge>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={handleRestart} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Practice Again
            </Button>
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                Back to Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Brain className="w-8 h-8 text-blue-500" />
              <div>
                <h2 className="text-2xl font-bold">Adaptive Practice</h2>
                <p className="text-gray-600 capitalize">{subject} • {skillArea.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                {formatTime(timeElapsed)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={togglePause}
                className="flex items-center gap-2"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Question {Math.min(currentQuestionIndex + 1, totalQuestions)} of {totalQuestions}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
            
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{correctAnswers} Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>{questionsCompleted - correctAnswers} Incorrect</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      {isGenerating ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Brain className="w-8 h-8 mx-auto mb-4 text-blue-500 animate-pulse" />
            <p className="text-lg">Generating next question...</p>
          </CardContent>
        </Card>
      ) : currentQuestion ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start p-4 h-auto text-left"
                  onClick={() => !isPaused && handleAnswerSubmit(index)}
                  disabled={isPaused}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-600">Loading question...</p>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Badge variant="outline">
              Level {difficultyLevel}
            </Badge>
            {onBack && (
              <Button variant="ghost" onClick={onBack}>
                Exit Practice
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptivePracticeModule;
