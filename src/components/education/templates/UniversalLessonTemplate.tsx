
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, RotateCcw, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

interface LessonQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  skillArea: string;
}

interface UniversalLessonTemplateProps {
  subject: string;
  skillArea: string;
  studentName?: string;
  onComplete: () => void;
  onBack: () => void;
}

// Stable question generation function
const generateStableQuestions = (subject: string, skillArea: string): LessonQuestion[] => {
  const questionTemplates = {
    mathematics: [
      {
        question: "Sarah has 24 stickers. She gives 8 stickers to her friend. How many stickers does Sarah have left?",
        options: ["16", "32", "18", "14"],
        correctAnswer: 0,
        explanation: "Sarah started with 24 stickers and gave away 8. So 24 - 8 = 16 stickers left."
      },
      {
        question: "A box contains 6 rows of cookies with 4 cookies in each row. How many cookies are in the box?",
        options: ["24", "20", "26", "22"],
        correctAnswer: 0,
        explanation: "There are 6 rows with 4 cookies each. So 6 × 4 = 24 cookies total."
      },
      {
        question: "Tom collected 45 marbles. He wants to share them equally among 5 friends. How many marbles will each friend get?",
        options: ["9", "8", "10", "7"],
        correctAnswer: 0,
        explanation: "Tom has 45 marbles to share among 5 friends. So 45 ÷ 5 = 9 marbles each."
      },
      {
        question: "Emma bought 3 packs of pencils. Each pack has 12 pencils. How many pencils did Emma buy in total?",
        options: ["36", "32", "38", "34"],
        correctAnswer: 0,
        explanation: "Emma bought 3 packs with 12 pencils each. So 3 × 12 = 36 pencils total."
      },
      {
        question: "A pizza is cut into 8 equal slices. If Jake eats 3 slices, what fraction of the pizza is left?",
        options: ["5/8", "3/8", "1/2", "2/3"],
        correctAnswer: 0,
        explanation: "The pizza has 8 slices total. Jake ate 3, so 8 - 3 = 5 slices remain. That's 5/8 of the pizza."
      }
    ],
    science: [
      {
        question: "What do plants need to make their own food through photosynthesis?",
        options: ["Sunlight, water, and carbon dioxide", "Only water", "Only sunlight", "Soil and air"],
        correctAnswer: 0,
        explanation: "Plants need sunlight, water, and carbon dioxide to make glucose through photosynthesis."
      },
      {
        question: "Which state of matter has a definite shape and volume?",
        options: ["Solid", "Liquid", "Gas", "Plasma"],
        correctAnswer: 0,
        explanation: "Solids have both definite shape and volume because their particles are tightly packed."
      },
      {
        question: "What is the closest star to Earth?",
        options: ["The Sun", "Alpha Centauri", "Sirius", "Polaris"],
        correctAnswer: 0,
        explanation: "The Sun is our closest star, about 93 million miles away from Earth."
      }
    ],
    english: [
      {
        question: "Which word is a noun in this sentence: 'The happy dog ran quickly'?",
        options: ["dog", "happy", "ran", "quickly"],
        correctAnswer: 0,
        explanation: "A noun is a person, place, or thing. 'Dog' is a thing, so it's the noun."
      },
      {
        question: "What is the past tense of the verb 'run'?",
        options: ["ran", "running", "runs", "runned"],
        correctAnswer: 0,
        explanation: "The past tense of 'run' is 'ran'. It's an irregular verb."
      }
    ]
  };

  const templates = questionTemplates[subject.toLowerCase() as keyof typeof questionTemplates] || questionTemplates.mathematics;
  
  return templates.map((template, index) => ({
    id: `${subject}_${skillArea}_${index + 1}`,
    ...template,
    subject,
    skillArea
  }));
};

const UniversalLessonTemplate: React.FC<UniversalLessonTemplateProps> = ({
  subject,
  skillArea,
  studentName = "Student",
  onComplete,
  onBack
}) => {
  // Stable state management
  const [questions] = useState(() => generateStableQuestions(subject, skillArea));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
  
  const processingRef = useRef(false);
  const currentQuestion = questions[currentQuestionIndex];

  // Speech integration
  const { speakAsNelie, isSpeaking, isEnabled, toggleEnabled, forceStopAll } = useUnifiedSpeech();

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      forceStopAll();
    };
  }, [forceStopAll]);

  // Auto-read question when it changes
  useEffect(() => {
    if (currentQuestion && isEnabled && !showResult) {
      const timer = setTimeout(() => {
        speakAsNelie(`Here's your question: ${currentQuestion.question}`, false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, isEnabled, showResult, speakAsNelie]);

  const handleAnswerClick = useCallback((answerIndex: number) => {
    if (processingRef.current || showResult || selectedAnswer !== null) {
      return;
    }

    processingRef.current = true;
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 20);
      speakAsNelie("Excellent work! That's correct!", false);
    } else {
      speakAsNelie(`Not quite right. ${currentQuestion.explanation}`, false);
    }

    setCompletedQuestions(prev => new Set([...prev, currentQuestionIndex]));

    // Auto-advance after 4 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        processingRef.current = false;
      } else {
        // Lesson complete
        speakAsNelie(`Fantastic job, ${studentName}! You've completed your ${subject} lesson!`, false);
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
    }, 4000);
  }, [currentQuestion, currentQuestionIndex, questions.length, showResult, selectedAnswer, studentName, subject, speakAsNelie, onComplete]);

  const handleReadQuestion = useCallback(() => {
    if (currentQuestion) {
      if (isSpeaking) {
        forceStopAll();
      } else {
        speakAsNelie(`Here's your question: ${currentQuestion.question}`, true);
      }
    }
  }, [currentQuestion, isSpeaking, speakAsNelie, forceStopAll]);

  const handleNavigation = useCallback((direction: 'prev' | 'next') => {
    if (processingRef.current) return;

    const newIndex = direction === 'prev' 
      ? Math.max(0, currentQuestionIndex - 1)
      : Math.min(questions.length - 1, currentQuestionIndex + 1);

    if (newIndex !== currentQuestionIndex) {
      setCurrentQuestionIndex(newIndex);
      setSelectedAnswer(null);
      setShowResult(false);
      forceStopAll();
    }
  }, [currentQuestionIndex, questions.length, forceStopAll]);

  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  const timeElapsed = Math.floor((Date.now() - startTime) / 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-black/50 border-blue-400/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={onBack}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
                <div className="text-white">
                  <h1 className="text-xl font-bold">{subject} Learning</h1>
                  <p className="text-sm text-gray-300">Welcome, {studentName}!</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-white">
                <div className="text-center">
                  <div className="text-sm text-gray-300">Progress</div>
                  <div className="font-bold">{progress}%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-300">Score</div>
                  <div className="font-bold">{score}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-300">Time</div>
                  <div className="font-bold">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</div>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="bg-black/50 border-blue-400/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Question Number */}
              <div className="text-center">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>

              {/* Question */}
              <div className="bg-slate-800/90 rounded-lg p-6 border-2 border-blue-400/50">
                <h2 className="text-white text-xl font-semibold leading-relaxed">
                  {currentQuestion?.question}
                </h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion?.options.map((option, index) => {
                  let buttonClass = "bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-left transition-all duration-200 border-2 border-gray-600";
                  
                  if (showResult) {
                    if (index === currentQuestion.correctAnswer) {
                      buttonClass = "bg-green-600 text-white p-4 rounded-lg text-left border-2 border-green-400";
                    } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                      buttonClass = "bg-red-600 text-white p-4 rounded-lg text-left border-2 border-red-400";
                    } else {
                      buttonClass = "bg-gray-600 text-gray-300 p-4 rounded-lg text-left border-2 border-gray-500";
                    }
                  } else if (selectedAnswer === index) {
                    buttonClass = "bg-blue-600 text-white p-4 rounded-lg text-left border-2 border-blue-400";
                  }

                  return (
                    <Button
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      disabled={showResult || selectedAnswer !== null}
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
                <div className={`p-4 rounded-lg ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-900/50 border border-green-400' : 'bg-red-900/50 border border-red-400'}`}>
                  <p className="text-white font-semibold mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer ? '🎉 Correct!' : '❌ Incorrect'}
                  </p>
                  <p className="text-gray-200">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="bg-black/50 border-blue-400/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleNavigation('prev')}
                  disabled={currentQuestionIndex === 0}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleNavigation('next')}
                  disabled={currentQuestionIndex === questions.length - 1}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleReadQuestion}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isSpeaking ? 'Stop' : 'Read'}
                </Button>
                
                <Button
                  onClick={toggleEnabled}
                  variant="ghost"
                  size="sm"
                  className={`${isEnabled ? 'text-green-400' : 'text-gray-400'} hover:bg-white/10`}
                >
                  {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  Auto-Read {isEnabled ? 'On' : 'Off'}
                </Button>

                <Button
                  onClick={() => window.location.reload()}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UniversalLessonTemplate;
