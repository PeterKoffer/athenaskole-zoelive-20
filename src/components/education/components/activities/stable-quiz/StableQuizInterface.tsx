
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Trophy, BookOpen } from 'lucide-react';
import { StableQuizQuestion } from './StableQuizQuestion';
import AnswerOptions from '../../AnswerOptions';
import { Badge } from '@/components/ui/badge';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject?: string;
  skillArea?: string;
}

interface StableQuizInterfaceProps {
  questions: QuizQuestion[];
  onComplete: (score: number, responses: any[]) => void;
  subject: string;
  title?: string;
}

export const StableQuizInterface = ({ 
  questions, 
  onComplete, 
  subject,
  title = "Interactive Learning"
}: StableQuizInterfaceProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Welcome message when quiz starts
  useEffect(() => {
    if (currentQuestionIndex === 0 && !showResult) {
      const welcomeMessage = getSubjectWelcome(subject);
      setTimeout(() => {
        speakAsNelie(welcomeMessage, true, 'quiz-welcome');
      }, 1000);
    }
  }, [currentQuestionIndex, showResult, subject, speakAsNelie]);

  const getSubjectWelcome = (subject: string) => {
    const welcomes = {
      music: "Welcome to our magical music journey! Today we'll explore the wonderful world of instruments, melodies, and rhythms. Let's discover the beauty of music together!",
      mathematics: "Welcome to our mathematical adventure! Today we'll solve exciting problems and discover the amazing patterns in numbers. Math is everywhere around us!",
      science: "Welcome to our science laboratory! Today we'll explore the wonders of our world through exciting experiments and discoveries. Science is amazing!",
      english: "Welcome to our literary adventure! Today we'll dive into stories, words, and the magic of language. Let's explore together!",
      default: "Welcome to today's learning adventure! I'm so excited to explore and discover new things with you today!"
    };
    return welcomes[subject as keyof typeof welcomes] || welcomes.default;
  };

  const handleSpeakTitle = async () => {
    if (isSpeaking) {
      stop();
    } else {
      await speakAsNelie(`Today's lesson: ${title}`, true, 'lesson-title');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const response = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent: timeElapsed
    };

    setResponses(prev => [...prev, response]);
    if (isCorrect) setScore(prev => prev + 1);
    setShowResult(true);

    // Nelie's feedback
    setTimeout(() => {
      const feedback = isCorrect 
        ? "Excellent! That's absolutely correct! " + currentQuestion.explanation
        : "Not quite right this time, but that's okay! " + currentQuestion.explanation;
      speakAsNelie(feedback, true, 'question-feedback');
    }, 500);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeElapsed(0);
    } else {
      onComplete(score, responses);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Enhanced Header with Speaker */}
      <Card className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 border-purple-400">
        <CardHeader className="relative">
          <button
            onClick={handleSpeakTitle}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm border border-sky-400/30"
            title="Ask Nelie to read the lesson title"
          >
            <CustomSpeakerIcon className="w-5 h-5" size={20} color="#0ea5e9" />
          </button>
          
          <CardTitle className="text-2xl text-white pr-16">{title}</CardTitle>
          
          <div className="flex flex-wrap items-center gap-4 text-purple-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>Score: {score}/{responses.length}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-purple-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Section */}
      <StableQuizQuestion question={currentQuestion.question} />

      {/* Answer Options */}
      <AnswerOptions
        options={currentQuestion.options}
        selectedAnswer={selectedAnswer}
        correctAnswer={currentQuestion.correctAnswer}
        showResult={showResult}
        onAnswerSelect={handleAnswerSelect}
      />

      {/* Explanation */}
      {showResult && (
        <Card className={`${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-900 border-green-600' : 'bg-red-900 border-red-600'}`}>
          <CardContent className="relative p-6">
            <button
              onClick={() => speakAsNelie(currentQuestion.explanation, true, 'explanation')}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm border border-sky-400/30"
              title="Ask Nelie to explain"
            >
              <CustomSpeakerIcon className="w-4 h-4" size={16} color="#0ea5e9" />
            </button>
            
            <h3 className={`text-lg font-semibold mb-3 pr-12 ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-100' : 'text-red-100'}`}>
              {selectedAnswer === currentQuestion.correctAnswer ? "🎉 Perfect!" : "🤔 Let's Learn!"}
            </h3>
            <p className={`${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-200' : 'text-red-200'}`}>
              {currentQuestion.explanation}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {isSpeaking && (
            <div className="flex items-center text-blue-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm">Nelie is speaking...</span>
            </div>
          )}
        </div>

        <div className="space-x-3">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-8 py-2"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-2"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Continue Learning 🚀' : 'Complete Lesson ✨'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
