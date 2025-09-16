// src/pages/LearningPage.tsx - Consolidated Subject Learning
import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { invokeFn } from '@/supabase/functionsClient';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import type { AdaptiveContentRes } from '@/types/api';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const LearningPage: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { speakText, isReady } = useUnifiedSpeech();
  
  // State management
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<AdaptiveContentRes | null>(null);

  // Demo questions for immediate functionality
  const demoQuestions: Question[] = [
    {
      question: "What is 15 + 27?",
      options: ["42", "41", "43", "40"],
      correct: 0,
      explanation: "15 + 27 = 42. You can break this down as 15 + 20 + 7 = 35 + 7 = 42."
    },
    {
      question: "Which fraction is equivalent to 0.5?",
      options: ["1/3", "1/2", "2/3", "3/4"],
      correct: 1,
      explanation: "0.5 is the same as 1/2 because 1 ÷ 2 = 0.5."
    },
    {
      question: "What is 8 × 7?",
      options: ["54", "56", "58", "52"],
      correct: 1,
      explanation: "8 × 7 = 56. You can think of this as 8 × 7 = (8 × 6) + 8 = 48 + 8 = 56."
    }
  ];

  const [questions] = useState<Question[]>(demoQuestions);

  // Timer effect
  useEffect(() => {
    if (hasStarted && !showResult) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [hasStarted, showResult]);

  // Load adaptive content
  useEffect(() => {
    if (subject && hasStarted) {
      loadContent();
    }
  }, [subject, hasStarted]);

  const loadContent = async () => {
    if (!subject) return;
    
    setLoading(true);
    try {
      const result = await invokeFn<AdaptiveContentRes>('adaptive-content', {
        subject,
        grade: 5,
        performance: 'average'
      });
      setContent(result);
      toast({
        title: "Content loaded",
        description: `Generated ${subject} content for grade 5`,
      });
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Using demo content",
        description: "Failed to load adaptive content, using demo questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startLearning = () => {
    setHasStarted(true);
    setTimeElapsed(0);
    toast({
      title: "Learning session started!",
      description: `Welcome to ${subject || 'Mathematics'} learning`,
    });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === questions[currentQuestion].correct;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      toast({
        title: "Correct! 🎉",
        description: questions[currentQuestion].explanation,
      });
      
      if (isReady) {
        speakText("Correct! " + questions[currentQuestion].explanation);
      }
    } else {
      setStreak(0);
      toast({
        title: "Not quite right",
        description: questions[currentQuestion].explanation,
        variant: "destructive"
      });
      
      if (isReady) {
        speakText("Not quite right. " + questions[currentQuestion].explanation);
      }
    }
    
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(null);
    } else {
      // End of session
      toast({
        title: "Session Complete! 🎉",
        description: `Final score: ${score}/${questions.length}`,
      });
      
      if (isReady) {
        speakText(`Session complete! Your final score is ${score} out of ${questions.length}`);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Subject not found</h1>
          <p className="mt-2 text-muted-foreground">Please select a valid subject to learn.</p>
          <button 
            onClick={() => navigate('/daily')}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Back to Daily Hub
          </button>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg text-center space-y-6">
          <h1 className="text-3xl font-bold capitalize">{subject} Learning</h1>
          <p className="text-muted-foreground">
            Ready to start your {subject} learning session? We'll adapt the content to your level.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>📚 {questions.length} practice questions</p>
            <p>🎯 Adaptive difficulty</p>
            <p>🔊 Voice explanations</p>
          </div>
          <button
            onClick={startLearning}
            className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Start Learning Session
          </button>
          <button
            onClick={() => navigate('/daily')}
            className="w-full py-2 px-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
          >
            Back to Daily Hub
          </button>
        </div>
      </div>
    );
  }

  if (currentQuestion >= questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg text-center space-y-6">
          <h1 className="text-3xl font-bold">Session Complete! 🎉</h1>
          <div className="space-y-4">
            <div className="text-4xl font-bold text-primary">
              {score}/{questions.length}
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>⏱️ Time: {formatTime(timeElapsed)}</p>
              <p>🔥 Best streak: {streak}</p>
              <p>📈 Accuracy: {Math.round((score / questions.length) * 100)}%</p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setTimeElapsed(0);
                setStreak(0);
                setSelectedAnswer(null);
                setShowResult(false);
                setIsCorrect(null);
                setHasStarted(false);
              }}
              className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/daily')}
              className="w-full py-2 px-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
            >
              Back to Daily Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/daily')}
            className="px-4 py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold capitalize">{subject}</h1>
          <div className="text-sm text-muted-foreground">
            {formatTime(timeElapsed)}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>Score: {score}/{questions.length}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold">
            {questions[currentQuestion].question}
          </h2>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                  selectedAnswer === null
                    ? 'border-border hover:bg-secondary/50 hover:border-primary/50'
                    : selectedAnswer === index
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                      : 'border-red-500 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                    : index === questions[currentQuestion].correct && selectedAnswer !== null
                    ? 'border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                    : 'border-border opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm">{questions[currentQuestion].explanation}</p>
              <button
                onClick={nextQuestion}
                className="mt-3 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Session'}
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">{score}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">{streak}</div>
            <div className="text-sm text-muted-foreground">Streak</div>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round((score / (currentQuestion + 1)) * 100) || 0}%
            </div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;