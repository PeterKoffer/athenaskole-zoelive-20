import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Trophy, Target } from 'lucide-react';

interface SimpleMathLearningContentProps {
  onBackToProgram: () => void;
}

const SimpleMathLearningContent = ({ onBackToProgram }: SimpleMathLearningContentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Sample math questions for 3rd grade
  const questions = [
    {
      question: "What is 8 + 5?",
      options: ["11", "12", "13", "14"],
      correct: 2,
      explanation: "8 + 5 = 13. Great job!"
    },
    {
      question: "If you have 24 apples and share them equally among 6 friends, how many apples does each friend get?",
      options: ["3", "4", "5", "6"],
      correct: 1,
      explanation: "24 ÷ 6 = 4. Each friend gets 4 apples!"
    },
    {
      question: "What is 7 × 3?",
      options: ["18", "20", "21", "24"],
      correct: 2,
      explanation: "7 × 3 = 21. Excellent work!"
    },
    {
      question: "Sarah has 15 stickers. She gives away 7 stickers. How many does she have left?",
      options: ["6", "7", "8", "9"],
      correct: 2,
      explanation: "15 - 7 = 8. Sarah has 8 stickers left!"
    },
    {
      question: "What comes next in this pattern: 2, 4, 6, 8, ?",
      options: ["9", "10", "11", "12"],
      correct: 1,
      explanation: "The pattern increases by 2 each time, so 8 + 2 = 10!"
    }
  ];

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

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
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Lesson complete
      alert(`Great job! You scored ${score + (selectedAnswer === questions[currentQuestion].correct ? 10 : 0)} points!`);
      onBackToProgram();
    }
  };

  const currentQ = questions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onBackToProgram}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Training Ground
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center text-white">
                <Target className="w-5 h-5 mr-2 text-lime-400" />
                <div>
                  <span className="text-sm text-gray-400">Activity</span>
                  <div className="font-bold">{currentQuestion + 1}</div>
                </div>
              </div>
              
              <div className="flex items-center text-white">
                <div>
                  <span className="text-sm text-gray-400">Total Activities</span>
                  <div className="font-bold">{questions.length}</div>
                </div>
              </div>

              <div className="flex items-center text-white">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                <div>
                  <span className="text-sm text-gray-400">Time</span>
                  <div className="font-bold">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</div>
                </div>
              </div>

              <div className="flex items-center text-white">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                <div>
                  <span className="text-sm text-gray-400">Score</span>
                  <div className="font-bold">{score}</div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
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

        {/* Question Card */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              Question {currentQuestion + 1} of {questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              {currentQ.question}
            </h3>
            
            <div className="grid gap-3">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`p-4 text-left justify-start h-auto ${
                    showResult && index === currentQ.correct
                      ? 'bg-green-600 border-green-500'
                      : showResult && selectedAnswer === index && index !== currentQ.correct
                      ? 'bg-red-600 border-red-500'
                      : ''
                  }`}
                >
                  <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg space-y-4">
                <p className="text-gray-300">
                  {currentQ.explanation}
                </p>
                <Button 
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Lesson'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleMathLearningContent;