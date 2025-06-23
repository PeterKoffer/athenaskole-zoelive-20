import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, TrendingDown, Target, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUnifiedQuestionGeneration } from '@/hooks/useUnifiedQuestionGeneration';
import { useLearningProfile } from '@/hooks/useLearningProfile';
import AdaptiveDifficultyManager from '../adaptive-learning/AdaptiveDifficultyManager';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useToast } from '@/hooks/use-toast';

interface AdaptiveEducationSessionProps {
  subject: string;
  skillArea: string;
  studentName?: string;
  onComplete: () => void;
  onBack: () => void;
}

const AdaptiveEducationSession: React.FC<AdaptiveEducationSessionProps> = ({
  subject,
  skillArea,
  studentName = "Student",
  onComplete,
  onBack
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { speakAsNelie, isEnabled } = useUnifiedSpeech();
  
  // Learning profile and adaptive difficulty
  const { profile, updateProfile, getRecommendedDifficulty, getPersonalizedSettings } = useLearningProfile(subject, skillArea);
  const [currentDifficulty, setCurrentDifficulty] = useState(1);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    accuracy: 0,
    averageTime: 0,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
    totalAttempts: 0
  });

  // Session state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [sessionComplete, setSessionComplete] = useState(false);

  const totalQuestions = getPersonalizedSettings().attentionSpan || 8;

  // AI Question Generation
  const {
    generateUniqueQuestion,
    currentQuestion,
    isGenerating,
    saveQuestionHistory
  } = useUnifiedQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel: currentDifficulty,
    userId: user?.id || '',
    gradeLevel: profile?.current_difficulty_level || 5,
    standardsAlignment: null,
    enablePersistence: true
  });

  // Initialize session
  useEffect(() => {
    if (profile) {
      const recommendedDifficulty = getRecommendedDifficulty();
      setCurrentDifficulty(recommendedDifficulty);
      console.log(`🎯 Starting adaptive session for ${studentName} at difficulty ${recommendedDifficulty}`);
    }
  }, [profile, getRecommendedDifficulty, studentName]);

  // Generate first question
  useEffect(() => {
    if (currentDifficulty > 0 && !currentQuestion && !isGenerating) {
      loadNextQuestion();
    }
  }, [currentDifficulty, currentQuestion, isGenerating]);

  const loadNextQuestion = async () => {
    try {
      setQuestionStartTime(Date.now());
      
      // Generate AI question with current difficulty
      await generateUniqueQuestion({
        personalizedContext: {
          studentName,
          learningStyle: profile?.learning_style,
          previousAccuracy: performanceMetrics.accuracy,
          difficultyLevel: currentDifficulty
        }
      });

      // Auto-read question if enabled
      if (isEnabled && currentQuestion) {
        setTimeout(() => {
          speakAsNelie(`${studentName}, here's your question: ${currentQuestion.content.question}`, false);
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to generate question:', error);
      toast({
        title: "Generation Error",
        description: "Failed to create personalized question. Using fallback.",
        variant: "destructive"
      });
    }
  };

  const handleAnswerClick = async (answerIndex: number) => {
    if (showResult || selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === currentQuestion?.content.correctAnswer;
    const responseTime = (Date.now() - questionStartTime) / 1000;

    // Update performance metrics
    const newMetrics = {
      ...performanceMetrics,
      totalAttempts: performanceMetrics.totalAttempts + 1,
      consecutiveCorrect: isCorrect ? performanceMetrics.consecutiveCorrect + 1 : 0,
      consecutiveIncorrect: isCorrect ? 0 : performanceMetrics.consecutiveIncorrect + 1,
      accuracy: ((performanceMetrics.accuracy * performanceMetrics.totalAttempts) + (isCorrect ? 100 : 0)) / (performanceMetrics.totalAttempts + 1),
      averageTime: ((performanceMetrics.averageTime * performanceMetrics.totalAttempts) + responseTime) / (performanceMetrics.totalAttempts + 1)
    };
    setPerformanceMetrics(newMetrics);

    if (isCorrect) {
      setScore(prev => prev + (10 * currentDifficulty));
      speakAsNelie(`Excellent work, ${studentName}! That's correct!`, false);
    } else {
      speakAsNelie(`Not quite right, ${studentName}. ${currentQuestion?.content.explanation}`, false);
    }

    // Save question history for learning analytics
    if (currentQuestion) {
      await saveQuestionHistory(currentQuestion, answerIndex, isCorrect, responseTime, {
        difficulty: currentDifficulty,
        sessionId: `session_${sessionStartTime}`,
        studentName
      });
    }

    // Auto-advance after 4 seconds
    setTimeout(() => {
      if (currentQuestionIndex + 1 >= totalQuestions) {
        handleSessionComplete();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        loadNextQuestion();
      }
    }, 4000);
  };

  const handleDifficultyChange = (newLevel: number, reason: string) => {
    setCurrentDifficulty(newLevel);
    toast({
      title: "Difficulty Adjusted",
      description: `${reason} - Now at level ${newLevel}`,
      duration: 3000
    });
  };

  const handleSessionComplete = async () => {
    setSessionComplete(true);
    
    // Update learning profile with accuracy_rate instead of overall_accuracy
    await updateProfile({
      current_difficulty_level: currentDifficulty,
      accuracy_rate: performanceMetrics.accuracy, // Changed from overall_accuracy to accuracy_rate
      total_sessions: (profile?.total_sessions || 0) + 1,
      last_updated: new Date().toISOString(),
      consistency_score: Math.min(100, (performanceMetrics.accuracy + (100 - performanceMetrics.averageTime * 2))),
      attention_span_minutes: Math.round((Date.now() - sessionStartTime) / 60000)
    });

    speakAsNelie(`Fantastic job, ${studentName}! You've completed your adaptive ${subject} session with ${Math.round(performanceMetrics.accuracy)}% accuracy!`, false);
    
    setTimeout(onComplete, 3000);
  };

  if (!user) {
    return (
      <Card className="bg-red-900 border-red-700">
        <CardContent className="p-6 text-center text-white">
          <Brain className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Login Required</h3>
          <p className="text-red-300">Please log in to access adaptive learning.</p>
        </CardContent>
      </Card>
    );
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-black/50 border-green-400/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">Session Complete!</h1>
              <p className="text-xl text-green-300 mb-6">
                Great job, {studentName}! You achieved {Math.round(performanceMetrics.accuracy)}% accuracy
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-800/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-white">{score}</div>
                  <div className="text-green-300">Total Score</div>
                </div>
                <div className="bg-blue-800/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-white">Level {currentDifficulty}</div>
                  <div className="text-blue-300">Difficulty Reached</div>
                </div>
              </div>
              <Button onClick={onComplete} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3">
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isGenerating || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 flex items-center justify-center">
        <Card className="bg-black/50 border-blue-400/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 text-blue-400 animate-pulse mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Generating Personalized Question</h3>
            <p className="text-gray-300">Creating content tailored to your learning level...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Adaptive Difficulty */}
        <Card className="bg-black/50 border-blue-400/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button onClick={onBack} variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  ← Back
                </Button>
                <div className="text-white">
                  <h1 className="text-xl font-bold">Adaptive {subject} Learning</h1>
                  <p className="text-sm text-gray-300">Welcome, {studentName}!</p>
                </div>
              </div>
              
              <AdaptiveDifficultyManager
                currentDifficulty={currentDifficulty}
                onDifficultyChange={handleDifficultyChange}
                performanceMetrics={performanceMetrics}
              />
            </div>
            
            {/* Progress Bar */}
            <div className="bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
            <div className="text-center text-white text-sm mt-2">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="bg-black/50 border-blue-400/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Question */}
              <div className="bg-slate-800/90 rounded-lg p-6 border-2 border-blue-400/50">
                <h2 className="text-white text-xl font-semibold leading-relaxed">
                  {currentQuestion.content.question}
                </h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.content.options?.map((option, index) => {
                  let buttonClass = "bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-left transition-all duration-200 border-2 border-gray-600";
                  
                  if (showResult) {
                    if (index === currentQuestion.content.correctAnswer) {
                      buttonClass = "bg-green-600 text-white p-4 rounded-lg text-left border-2 border-green-400";
                    } else if (index === selectedAnswer && index !== currentQuestion.content.correctAnswer) {
                      buttonClass = "bg-red-600 text-white p-4 rounded-lg text-left border-2 border-red-400";
                    } else {
                      buttonClass = "bg-gray-600 text-gray-300 p-4 rounded-lg text-left border-2 border-gray-500";
                    }
                  }

                  return (
                    <Button
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      disabled={showResult}
                      className={buttonClass}
                    >
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  );
                })}
              </div>

              {/* Result */}
              {showResult && (
                <div className={`p-4 rounded-lg ${selectedAnswer === currentQuestion.content.correctAnswer ? 'bg-green-900/50 border border-green-400' : 'bg-red-900/50 border border-red-400'}`}>
                  <p className="text-white font-semibold mb-2">
                    {selectedAnswer === currentQuestion.content.correctAnswer ? '🎉 Correct!' : '❌ Incorrect'}
                  </p>
                  <p className="text-gray-200">{currentQuestion.content.explanation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card className="bg-black/50 border-blue-400/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4 text-center text-white">
              <div>
                <div className="text-2xl font-bold text-green-400">{Math.round(performanceMetrics.accuracy)}%</div>
                <div className="text-sm text-gray-300">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{score}</div>
                <div className="text-sm text-gray-300">Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{performanceMetrics.consecutiveCorrect}</div>
                <div className="text-sm text-gray-300">Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{Math.round(performanceMetrics.averageTime)}s</div>
                <div className="text-sm text-gray-300">Avg Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdaptiveEducationSession;
