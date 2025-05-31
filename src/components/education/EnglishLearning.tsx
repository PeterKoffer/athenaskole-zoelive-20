
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdaptiveLearning } from "@/hooks/useAdaptiveLearning";
import { shouldAdjustDifficulty } from "@/utils/adaptiveLearningUtils";
import EnglishHeader from "./english/EnglishHeader";
import EnglishQuestion from "./english/EnglishQuestion";

const EnglishLearning = () => {
  const navigate = useNavigate();
  const [currentActivity, setCurrentActivity] = useState(0);
  const [score, setScore] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);

  const {
    difficulty,
    performanceMetrics,
    recordAnswer,
    adjustDifficulty,
    endSession,
    isLoading
  } = useAdaptiveLearning("english", "reading_spelling");

  const activities = [
    {
      type: "reading",
      title: "Read and Understand",
      content: "The cat sat on the mat. It was a sunny day and the cat was happy.",
      question: "How was the cat feeling?",
      options: ["Sad", "Happy", "Angry", "Tired"],
      correct: 1
    },
    {
      type: "spelling",
      title: "Complete the Word",
      content: "Fill in the missing letters:",
      question: "Beauti_ul",
      options: ["f", "v", "w", "k"],
      correct: 0
    },
    {
      type: "vocabulary",
      title: "Word Meaning",
      content: "What does 'enormous' mean?",
      question: "Choose the correct meaning:",
      options: ["Very small", "Very big", "Very fast", "Very slow"],
      correct: 1
    }
  ];

  const totalQuestions = activities.length;

  const handleAnswer = async (isCorrect: boolean, responseTime: number) => {
    await recordAnswer(isCorrect, responseTime);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setQuestionsCompleted(questionsCompleted + 1);

    // Check if difficulty should be adjusted
    const adjustmentResult = shouldAdjustDifficulty(
      performanceMetrics.accuracy,
      performanceMetrics.consecutiveCorrect,
      performanceMetrics.consecutiveIncorrect,
      performanceMetrics.totalAttempts
    );

    if (adjustmentResult.shouldAdjust && adjustmentResult.newLevel && adjustmentResult.reason) {
      const newDifficulty = Math.max(1, Math.min(5, difficulty + adjustmentResult.newLevel));
      adjustDifficulty(newDifficulty, adjustmentResult.reason);
    }

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentActivity < activities.length - 1) {
        setCurrentActivity(currentActivity + 1);
      } else {
        handleComplete();
      }
    }, 2000);
  };

  const handleComplete = async () => {
    await endSession();
    navigate('/daily-program');
  };

  const handleDifficultyChange = (newLevel: number, reason: string) => {
    adjustDifficulty(newLevel, reason);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p>Loading adaptive learning session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/daily-program')}
            className="border-gray-600 text-white bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Button>
        </div>

        <div className="space-y-6">
          <EnglishHeader
            currentQuestion={currentActivity}
            totalQuestions={totalQuestions}
            score={score}
            difficulty={difficulty}
            performanceMetrics={performanceMetrics}
            onDifficultyChange={handleDifficultyChange}
          />

          <EnglishQuestion
            activity={activities[currentActivity]}
            onAnswer={handleAnswer}
            disabled={questionsCompleted >= totalQuestions}
          />
        </div>
      </div>
    </div>
  );
};

export default EnglishLearning;
