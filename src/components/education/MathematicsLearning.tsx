
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calculator, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SessionTimer from "@/components/adaptive-learning/SessionTimer";
import AdaptiveDifficultyManager from "@/components/adaptive-learning/AdaptiveDifficultyManager";
import LearningPathOptimizer from "@/components/adaptive-learning/LearningPathOptimizer";
import { useAdaptiveLearning } from "@/hooks/useAdaptiveLearning";

const MathematicsLearning = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  
  const {
    difficulty,
    performanceMetrics,
    userProgress,
    recommendedSessionTime,
    recordAnswer,
    adjustDifficulty,
    endSession,
    isLoading
  } = useAdaptiveLearning('mathematics', 'problem-solving');

  const questions = [
    {
      question: "What is 1/2 + 1/4?",
      options: ["1/6", "2/6", "3/4", "1/3"],
      correct: 2,
      explanation: "1/2 + 1/4 = 2/4 + 1/4 = 3/4",
      difficulty: 1
    },
    {
      question: "What is the area of a rectangle with length 5 and width 3?",
      options: ["8", "15", "10", "12"],
      correct: 1,
      explanation: "Area = length × width = 5 × 3 = 15",
      difficulty: 1
    },
    {
      question: "Solve: 2x + 4 = 10",
      options: ["x = 2", "x = 3", "x = 4", "x = 6"],
      correct: 1,
      explanation: "2x + 4 = 10, so 2x = 6, therefore x = 3",
      difficulty: 2
    },
    {
      question: "What is 3/4 × 2/3?",
      options: ["1/2", "5/7", "6/12", "2/4"],
      correct: 0,
      explanation: "3/4 × 2/3 = (3×2)/(4×3) = 6/12 = 1/2",
      difficulty: 2
    },
    {
      question: "Find the perimeter of a triangle with sides 3, 4, and 5",
      options: ["12", "10", "15", "8"],
      correct: 0,
      explanation: "Perimeter = 3 + 4 + 5 = 12",
      difficulty: 2
    },
    {
      question: "Solve: 3x - 7 = 2x + 5",
      options: ["x = 12", "x = 6", "x = 8", "x = 10"],
      correct: 0,
      explanation: "3x - 7 = 2x + 5, so 3x - 2x = 5 + 7, therefore x = 12",
      difficulty: 3
    }
  ];

  // Filter questions based on current difficulty
  const filteredQuestions = questions.filter(q => q.difficulty <= difficulty);
  const currentQuestionData = filteredQuestions[currentQuestion] || questions[0];
  const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100;

  const userProfile = {
    strengths: userProgress?.strengths || [],
    weaknesses: userProgress?.weaknesses || ['fractions'],
    learningStyle: 'mixed' as const,
    preferredPace: 'medium' as const
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestionData.correct;
    const responseTime = (new Date().getTime() - questionStartTime.getTime()) / 1000;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Record the answer for adaptive learning
    await recordAnswer(isCorrect, responseTime);
    
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setQuestionStartTime(new Date());
    } else {
      // Lesson complete
      endSession();
      navigate('/daily-program');
    }
  };

  const handleGoalSelect = (goal: any) => {
    // In a real implementation, this would navigate to the specific goal content
    console.log('Selected goal:', goal);
  };

  const handleTimeUp = () => {
    endSession();
  };

  const handleBreakSuggested = () => {
    // Could pause the session or show a break reminder
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <Calculator className="w-8 h-8 text-blue-400 animate-pulse mx-auto mb-4" />
          <p>Loading your personalized math session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/daily-program')}
            className="border-gray-600 text-white bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Button>
          <div className="text-lg font-semibold">
            Score: {score}/{filteredQuestions.length}
          </div>
        </div>

        {/* Session Timer */}
        <SessionTimer
          recommendedDuration={recommendedSessionTime}
          onTimeUp={handleTimeUp}
          onBreakSuggested={handleBreakSuggested}
        />

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span>Mathematics - Adaptive Learning</span>
              </div>
              <AdaptiveDifficultyManager
                currentDifficulty={difficulty}
                onDifficultyChange={adjustDifficulty}
                performanceMetrics={performanceMetrics}
              />
            </CardTitle>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {filteredQuestions.length}
            </p>
          </CardHeader>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-white">
              {currentQuestionData.question}
            </h3>

            <div className="space-y-3 mb-6">
              {currentQuestionData.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full text-left justify-start p-4 h-auto ${
                    selectedAnswer === index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  }`}
                  onClick={() => !showResult && handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="mr-3 font-semibold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className={`w-5 h-5 mr-2 ${
                    selectedAnswer === currentQuestionData.correct 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`} />
                  <span className={selectedAnswer === currentQuestionData.correct 
                    ? 'text-green-400 font-semibold' 
                    : 'text-red-400 font-semibold'
                  }>
                    {selectedAnswer === currentQuestionData.correct ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-gray-300">{currentQuestionData.explanation}</p>
              </div>
            )}

            <div className="flex justify-end">
              {!showResult ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {currentQuestion < filteredQuestions.length - 1 ? 'Next Question' : 'Complete Lesson'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Learning Path Optimizer */}
        <LearningPathOptimizer
          subject="mathematics"
          userProfile={userProfile}
          completedGoals={[]}
          onGoalSelect={handleGoalSelect}
        />
      </div>
    </div>
  );
};

export default MathematicsLearning;
