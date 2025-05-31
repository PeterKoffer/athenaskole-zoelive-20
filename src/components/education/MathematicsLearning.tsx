
import { useState, useEffect } from "react";
import { useLearningSession } from "@/hooks/useLearningSession";
import { useAdaptiveLearning } from "@/hooks/useAdaptiveLearning";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import MathHeader from "./math/MathHeader";
import MathQuestion from "./math/MathQuestion";
import SessionTimer from "../adaptive-learning/SessionTimer";
import PerformanceAnalytics from "../adaptive-learning/PerformanceAnalytics";
import LearningHeader from "./LearningHeader";

const MathematicsLearning = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);

  const {
    sessionData,
    startSession,
    endSession,
    updateProgress
  } = useLearningSession();

  const {
    difficulty,
    updateDifficulty,
    getAdaptiveQuestion
  } = useAdaptiveLearning();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    startSession('mathematics');
  }, [user, navigate, startSession]);

  const questions = [
    getAdaptiveQuestion('mathematics', difficulty),
    getAdaptiveQuestion('mathematics', difficulty)
  ];

  const handleAnswer = (isCorrect: boolean) => {
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    updateDifficulty(isCorrect);
    updateProgress({
      correct: isCorrect,
      timeSpent: 30,
      difficulty: difficulty
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      endSession();
    }
  };

  if (!user) return null;

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <LearningHeader />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Great work!</h1>
            <p className="text-xl">You scored {score} out of {questions.length}</p>
          </div>
          <PerformanceAnalytics 
            answers={answers}
            subject="mathematics"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LearningHeader />
      <div className="max-w-4xl mx-auto p-6">
        <SessionTimer />
        <MathHeader 
          score={score} 
          totalQuestions={questions.length}
          currentQuestion={currentQuestion}
          difficulty={difficulty}
        />
        <MathQuestion
          question={questions[currentQuestion]}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
};

export default MathematicsLearning;
