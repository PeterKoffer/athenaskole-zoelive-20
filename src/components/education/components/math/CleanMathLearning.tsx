import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';

interface CleanMathLearningProps {
  onBackToProgram: () => void;
}

const CleanMathLearning = ({ onBackToProgram }: CleanMathLearningProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(10);
  const [timeElapsed, setTimeElapsed] = useState(38);
  const [streak, setStreak] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Grade 3 math questions
  const questions = [
    {
      id: 1,
      question: "Emma has 24 stickers. She wants to share them equally among her 4 friends. How many stickers will each friend get?",
      options: ["5 stickers", "6 stickers", "7 stickers", "8 stickers"],
      correct: 1,
      explanation: "24 ÷ 4 = 6. Each friend gets 6 stickers!"
    },
    {
      id: 2,
      question: "What is 15 + 27?",
      options: ["41", "42", "43", "44"],
      correct: 1,
      explanation: "15 + 27 = 42. Great addition!"
    },
    {
      id: 3,
      question: "Jake has 3 boxes of crayons. Each box has 8 crayons. How many crayons does Jake have in total?",
      options: ["21", "22", "23", "24"],
      correct: 3,
      explanation: "3 × 8 = 24. Jake has 24 crayons!"
    },
    {
      id: 4,
      question: "What comes next in this pattern: 5, 10, 15, 20, ?",
      options: ["23", "24", "25", "30"],
      correct: 2,
      explanation: "The pattern increases by 5 each time: 20 + 5 = 25!"
    },
    {
      id: 5,
      question: "Sarah had 50 candies. She gave away 23 candies. How many candies does she have left?",
      options: ["26", "27", "28", "29"],
      correct: 1,
      explanation: "50 - 23 = 27. Sarah has 27 candies left!"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      alert(`Congratulations! You completed the lesson with ${score} points!`);
      onBackToProgram();
    }
  };

  const currentQ = questions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  const timeInMinutes = Math.floor(timeElapsed / 60);
  const timeInSeconds = timeElapsed % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Session Info */}
        <Card className="bg-gray-900/80 backdrop-blur border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBackToProgram}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Training Ground
              </button>
              <div className="flex items-center text-white space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">0:{timeInMinutes.toString().padStart(2, '0')}:{timeInSeconds.toString().padStart(2, '0')} / 20:00</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">{score} points</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-4">Peter's Mathematics Session</h1>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{currentQuestion + 1}</div>
                <div className="text-gray-400">Activity</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{questions.length}</div>
                <div className="text-gray-400">Total Activities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{streak}</div>
                <div className="text-gray-400">Correct Streak</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-lime-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Challenge Card */}
        <Card className="bg-gray-900/90 backdrop-blur border-gray-700">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600">
            <CardTitle className="text-white text-xl">
              general Challenge (20 min)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg text-white mb-6 leading-relaxed">
                  {currentQ.question}
                </h3>
                
                <div className="grid gap-3">
                  {currentQ.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className={`p-4 text-left justify-start h-auto text-base ${
                        showResult && index === currentQ.correct
                          ? 'bg-green-600 border-green-500 text-white'
                          : showResult && selectedAnswer === index && index !== currentQ.correct
                          ? 'bg-red-600 border-red-500 text-white'
                          : showResult
                          ? 'opacity-60'
                          : 'hover:bg-gray-700'
                      }`}
                    >
                      <span className="mr-4 font-bold text-lg">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>

                {showResult && (
                  <div className="mt-6 p-4 bg-blue-900/50 rounded-lg border border-blue-700">
                    <p className="text-blue-200 mb-4 text-base">
                      {currentQ.explanation}
                    </p>
                    <Button 
                      onClick={handleNext}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Complete Lesson ✨'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CleanMathLearning;