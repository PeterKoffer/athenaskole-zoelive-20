import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, VolumeX, Clock, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

interface SimplifiedLessonManagerProps {
  subject: string;
  skillArea: string;
  studentName: string;
  onBackToProgram: () => void;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

const SimplifiedLessonManager = ({
  subject,
  skillArea,
  studentName,
  onBackToProgram
}: SimplifiedLessonManagerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const { speak, isSpeaking, stop } = useUnifiedSpeech();
  const { user } = useAuth();

  // Simple math questions for now to get it working
  const questions: Question[] = [
    {
      id: '1',
      question: 'What is 7 + 5?',
      options: ['10', '11', '12', '13'],
      correctAnswer: 2,
      explanation: 'Seven plus five equals twelve!'
    },
    {
      id: '2', 
      question: 'What is 15 - 8?',
      options: ['6', '7', '8', '9'],
      correctAnswer: 1,
      explanation: 'Fifteen minus eight equals seven!'
    },
    {
      id: '3',
      question: 'What is 4 × 3?',
      options: ['10', '11', '12', '13'],
      correctAnswer: 2,
      explanation: 'Four times three equals twelve!'
    },
    {
      id: '4',
      question: 'What is 20 ÷ 4?',
      options: ['4', '5', '6', '7'],
      correctAnswer: 1,
      explanation: 'Twenty divided by four equals five!'
    },
    {
      id: '5',
      question: 'What is 9 + 6?',
      options: ['14', '15', '16', '17'],
      correctAnswer: 1,
      explanation: 'Nine plus six equals fifteen!'
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= questions.length - 1;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize lesson
  useEffect(() => {
    console.log('🎯 Simplified lesson manager initialized');
    setIsLoading(false);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (showResult) return;
    
    console.log(`📝 Answer selected: ${answerIndex} for question ${currentQuestionIndex + 1}`);
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 10);
    }

    // Auto advance after showing result
    setTimeout(() => {
      handleNextQuestion();
    }, 2500);
  }, [showResult, currentQuestion, currentQuestionIndex]);

  const handleNextQuestion = useCallback(() => {
    console.log(`➡️ Moving to next question. Current: ${currentQuestionIndex}, Total: ${questions.length}`);
    
    if (isLastQuestion) {
      console.log('🎉 Lesson completed!');
      onBackToProgram();
      return;
    }

    // Reset for next question
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [currentQuestionIndex, isLastQuestion, onBackToProgram]);

  const toggleMute = useCallback(() => {
    if (isSpeaking) {
      stop();
    }
  }, [isSpeaking, stop]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-center">
          <div className="text-4xl mb-4">🔢</div>
          <p className="text-lg">Starting your {subject} lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBackToProgram}
            className="flex items-center gap-2 text-white hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Training Ground
          </Button>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:text-gray-300"
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="bg-black/20 border-white/20 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">
                {studentName}'s Mathematics Session
              </h1>
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(timeElapsed)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>{score} points</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="text-white">
                <div className="text-2xl font-bold">{currentQuestionIndex + 1}</div>
                <div className="text-sm opacity-80">Question</div>
              </div>
              <div className="text-white">
                <div className="text-2xl font-bold">{questions.length}</div>
                <div className="text-sm opacity-80">Total Questions</div>
              </div>
              <div className="text-white">
                <div className="text-2xl font-bold">{Math.floor(score / 10)}</div>
                <div className="text-sm opacity-80">Correct</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Question Card */}
        <Card className="bg-black/20 border-white/20 backdrop-blur-sm">
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">
              {currentQuestion.question}
            </h2>
            
            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const showCorrectAnswer = showResult && isCorrect;
                const showWrongAnswer = showResult && isSelected && !isCorrect;
                
                return (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`p-4 text-left justify-start text-lg ${
                      showCorrectAnswer 
                        ? 'bg-green-600 hover:bg-green-600 text-white' 
                        : showWrongAnswer
                        ? 'bg-red-600 hover:bg-red-600 text-white'
                        : isSelected
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </Button>
                );
              })}
            </div>

            {showResult && (
              <div className="mt-6 p-4 bg-white/10 rounded-lg">
                <p className="text-white">
                  {selectedAnswer === currentQuestion.correctAnswer 
                    ? '✅ Correct! ' + currentQuestion.explanation
                    : '❌ Not quite. ' + currentQuestion.explanation
                  }
                </p>
                {!isLastQuestion && (
                  <p className="text-gray-300 text-sm mt-2">
                    Moving to next question automatically...
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SimplifiedLessonManager;