import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Brain, RefreshCw, CheckCircle, Clock, Target, Database } from 'lucide-react';
import QuestionCard from '@/components/adaptive-learning/components/QuestionCard';
import stealthAssessmentService from '@/services/stealthAssessment/StealthAssessmentService';
import ProfileDebugButton from '@/components/ProfileDebugButton';
import UserVerificationDebug from '@/components/UserVerificationDebug';
import { useToast } from '@/hooks/use-toast';

const StealthAssessmentTest: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>();
  const [tempSelected, setTempSelected] = useState<number | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [totalQuestions] = useState(5);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  const questions = [
    {
      id: 'stealth-q-001',
      question: 'What is 15 + 27?',
      options: ['40', '42', '43', '45'],
      correct: 1,
      explanation: '15 + 27 = 42. This tests basic addition skills.',
      learningObjectives: ['basic-arithmetic', 'addition'],
      estimatedTime: 45,
      conceptsCovered: ['mental-math', 'two-digit-addition'],
      knowledgeComponentIds: ['kc-addition-two-digit']
    },
    {
      id: 'stealth-q-002',
      question: 'Which of the following is a prime number?',
      options: ['15', '21', '17', '25'],
      correct: 2,
      explanation: '17 is prime because it can only be divided by 1 and itself.',
      learningObjectives: ['number-theory', 'prime-numbers'],
      estimatedTime: 60,
      conceptsCovered: ['prime-identification', 'divisibility'],
      knowledgeComponentIds: ['kc-prime-numbers']
    },
    {
      id: 'stealth-q-003',
      question: 'What is 8 × 7?',
      options: ['54', '56', '58', '63'],
      correct: 1,
      explanation: '8 × 7 = 56. This tests multiplication table knowledge.',
      learningObjectives: ['multiplication', 'times-tables'],
      estimatedTime: 30,
      conceptsCovered: ['basic-multiplication'],
      knowledgeComponentIds: ['kc-multiplication-single-digit']
    },
    {
      id: 'stealth-q-004',
      question: 'What is 144 ÷ 12?',
      options: ['11', '12', '13', '14'],
      correct: 1,
      explanation: '144 ÷ 12 = 12. This tests division skills.',
      learningObjectives: ['division', 'mental-calculation'],
      estimatedTime: 50,
      conceptsCovered: ['division-facts', 'inverse-operations'],
      knowledgeComponentIds: ['kc-division-basic']
    },
    {
      id: 'stealth-q-005',
      question: 'What is 25% of 80?',
      options: ['15', '20', '25', '30'],
      correct: 1,
      explanation: '25% of 80 = 0.25 × 80 = 20. This tests percentage calculations.',
      learningObjectives: ['percentages', 'decimal-operations'],
      estimatedTime: 75,
      conceptsCovered: ['percentage-calculation', 'fraction-decimal-percent'],
      knowledgeComponentIds: ['kc-percentages-basic']
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the stealth assessment test.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (user) {
      console.log('🎯 Stealth Assessment Test initialized for user:', user.id);
      setStartTime(Date.now());
      setQuestionStartTime(Date.now());
    }
  }, [user, loading, navigate, toast]);

  const handleOptionClick = (index: number) => {
    if (hasAnswered) return;
    setTempSelected(index);
  };

  const handleQuestionSubmit = (selectedIndex: number, isCorrect: boolean) => {
    const timeTaken = Date.now() - questionStartTime;
    
    setSelectedAnswer(selectedIndex);
    setHasAnswered(true);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Log to stealth assessment service
    console.log(`📝 Question ${currentQuestionIndex + 1} answered:`, {
      questionId: currentQuestion.id,
      selectedIndex,
      isCorrect,
      timeTaken
    });

    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: currentQuestion.explanation,
      variant: isCorrect ? "default" : "destructive"
    });

    // Auto advance after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        nextQuestion();
      } else {
        completeAssessment();
      }
    }, 2000);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setHasAnswered(false);
    setSelectedAnswer(undefined);
    setTempSelected(null);
    setAttemptNumber(1);
    setQuestionStartTime(Date.now());
  };

  const completeAssessment = () => {
    const totalTime = Date.now() - startTime;
    const finalScore = (score / totalQuestions) * 100;
    
    setIsComplete(true);
    
    console.log('🏁 Assessment completed:', {
      score,
      totalQuestions,
      percentage: finalScore,
      totalTime
    });

    toast({
      title: "Assessment Complete!",
      description: `You scored ${score}/${totalQuestions} (${Math.round(finalScore)}%)`,
    });
  };

  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setHasAnswered(false);
    setSelectedAnswer(undefined);
    setTempSelected(null);
    setAttemptNumber(1);
    setScore(0);
    setIsComplete(false);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    stealthAssessmentService.clearQueue();
    
    toast({
      title: "Assessment Reset",
      description: "Starting new assessment session",
    });
  };

  const checkConsoleOutput = () => {
    console.log('🔍 Stealth Assessment Service Status:');
    console.log('📊 Recent Events:', stealthAssessmentService.getRecentEvents(10));
    console.log('📈 Queue Size:', stealthAssessmentService.getQueueSize());
    
    toast({
      title: "Console Check",
      description: "Check the browser console for stealth assessment logs",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading Stealth Assessment...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm max-w-md">
          <CardContent className="p-8 text-center">
            <Eye className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-white text-xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-300 mb-6">Please sign in to access the stealth assessment test.</p>
            <Button onClick={() => navigate('/auth')} className="bg-purple-600 hover:bg-purple-700">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
            >
              <Database className="w-4 h-4 mr-2" />
              {showDebugPanel ? 'Hide' : 'Show'} User Data
            </Button>
            <ProfileDebugButton />
            <Button
              variant="outline"
              size="sm"
              onClick={checkConsoleOutput}
              className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              Check Console
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetAssessment}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Debug Panel */}
        {showDebugPanel && (
          <div className="mb-6">
            <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">User Verification Data</CardTitle>
              </CardHeader>
              <CardContent>
                <UserVerificationDebug />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        {!isComplete ? (
          <>
            {/* Progress Header */}
            <Card className="mb-6 bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Brain className="w-6 h-6 mr-2 text-cyan-400" />
                    Stealth Assessment Test
                  </CardTitle>
                  <Badge variant="secondary" className="bg-purple-600 text-white">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-white">
                    <Target className="w-5 h-5 text-green-400" />
                    <span>Score: {score}/{currentQuestionIndex + (hasAnswered ? 1 : 0)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span>Time: {Math.floor((Date.now() - startTime) / 1000)}s</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white">
                    <Eye className="w-5 h-5 text-purple-400" />
                    <span>Stealth Logging Active</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + (hasAnswered ? 1 : 0)) / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Question Card */}
            <div className="mb-6">
              <QuestionCard
                question={currentQuestion}
                hasAnswered={hasAnswered}
                selectedAnswer={selectedAnswer}
                tempSelected={tempSelected}
                onOptionClick={handleOptionClick}
                onAnswerSubmit={handleQuestionSubmit}
                currentAttemptNumber={attemptNumber}
              />
            </div>

            {/* Instructions */}
            <Card className="bg-blue-900/30 border-blue-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <h3 className="text-blue-200 font-semibold mb-2">💡 Stealth Assessment Instructions:</h3>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• All interactions are being logged for learning analytics</li>
                  <li>• Check browser console (F12) for detailed logging information</li>
                  <li>• Each question tracks response time, attempts, and accuracy</li>
                  <li>• Data is used to personalize your learning experience</li>
                  <li>• Use "Show User Data" button to verify database integration</li>
                </ul>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Results Screen */
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl mb-4">
                🎉 Assessment Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-600/20 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{score}</div>
                  <div className="text-green-200">Correct Answers</div>
                </div>
                <div className="p-4 bg-blue-600/20 rounded-lg">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {Math.round((score / totalQuestions) * 100)}%
                  </div>
                  <div className="text-blue-200">Accuracy</div>
                </div>
                <div className="p-4 bg-purple-600/20 rounded-lg">
                  <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {Math.floor((Date.now() - startTime) / 1000)}s
                  </div>
                  <div className="text-purple-200">Total Time</div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDebugPanel(!showDebugPanel)}
                  className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Check User Data
                </Button>
                <ProfileDebugButton />
                <Button onClick={resetAssessment} className="bg-purple-600 hover:bg-purple-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Take Again
                </Button>
                <Button onClick={() => navigate('/')} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StealthAssessmentTest;
