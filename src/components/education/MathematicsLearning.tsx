import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SessionTimer from "@/components/adaptive-learning/SessionTimer";
import LearningPathOptimizer from "@/components/adaptive-learning/LearningPathOptimizer";
import MathHeader from "./math/MathHeader";
import MathQuestion from "./math/MathQuestion";
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

  const filteredQuestions = questions.filter(q => q.difficulty <= difficulty);
  const currentQuestionData = filteredQuestions[currentQuestion] || questions[0];

  const userProfile = {
    strengths: [],
    weaknesses: ['fractions'],
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
      endSession();
      navigate('/daily-program');
    }
  };

  const handleGoalSelect = (goal: any) => {
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
          <div className="text-lg">Loading your personalized math session...</div>
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
        </div>

        <SessionTimer
          recommendedDuration={recommendedSessionTime}
          onTimeUp={handleTimeUp}
          onBreakSuggested={handleBreakSuggested}
        />

        <MathHeader
          currentQuestion={currentQuestion}
          totalQuestions={filteredQuestions.length}
          score={score}
          difficulty={difficulty}
          performanceMetrics={performanceMetrics}
          onDifficultyChange={adjustDifficulty}
        />

        <MathQuestion
          question={currentQuestionData}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          onAnswerSelect={handleAnswerSelect}
          onSubmit={handleSubmit}
          onNext={handleNext}
          isLastQuestion={currentQuestion >= filteredQuestions.length - 1}
        />

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
