
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAdaptiveLearning } from "@/hooks/useAdaptiveLearning";
import EnglishHeader from "./english/EnglishHeader";
import EnglishQuestion from "./english/EnglishQuestion";
import SessionTimer from "../adaptive-learning/SessionTimer";
import PerformanceAnalytics from "../adaptive-learning/PerformanceAnalytics";
import LearningHeader from "./LearningHeader";

const EnglishLearning = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);

  const {
    difficulty,
    performanceMetrics,
    recommendedSessionTime,
    recordAnswer,
    adjustDifficulty,
    endSession
  } = useAdaptiveLearning('english', 'comprehension');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  // Sample questions for English learning
  const questions = [
    {
      type: 'comprehension',
      title: 'Reading Comprehension',
      content: 'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.',
      question: 'What animal jumps in this sentence?',
      options: ['Dog', 'Fox', 'Cat', 'Bird'],
      correct: 1
    },
    {
      type: 'vocabulary',
      title: 'Vocabulary',
      content: 'The word "magnificent" means very impressive or beautiful.',
      question: 'What does "magnificent" mean?',
      options: ['Very small', 'Very ugly', 'Very impressive', 'Very fast'],
      correct: 2
    }
  ];

  const handleAnswer = (isCorrect: boolean, responseTime: number) => {
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    recordAnswer(isCorrect, responseTime);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      endSession();
    }
  };

  const handleDifficultyChange = (newLevel: number, reason: string) => {
    adjustDifficulty(newLevel, reason);
  };

  if (!user) return null;

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <LearningHeader />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Excellent!</h1>
            <p className="text-xl">You scored {score} out of {questions.length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Session Complete!</h3>
            <p className="text-gray-300">Great job practicing your English skills!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LearningHeader />
      <div className="max-w-4xl mx-auto p-6">
        <SessionTimer 
          recommendedDuration={recommendedSessionTime}
        />
        <EnglishHeader 
          score={score} 
          totalQuestions={questions.length}
          currentQuestion={currentQuestion}
          difficulty={difficulty}
          performanceMetrics={performanceMetrics}
          onDifficultyChange={handleDifficultyChange}
        />
        <EnglishQuestion
          activity={questions[currentQuestion]}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
};

export default EnglishLearning;
