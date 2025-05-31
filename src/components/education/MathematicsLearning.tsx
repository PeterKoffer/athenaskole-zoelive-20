
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAdaptiveLearning } from "@/hooks/useAdaptiveLearning";
import MathHeader from "./math/MathHeader";
import MathQuestion from "./math/MathQuestion";
import SessionTimer from "../adaptive-learning/SessionTimer";
import LearningHeader from "./LearningHeader";

const MathematicsLearning = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const {
    difficulty,
    performanceMetrics,
    recommendedSessionTime,
    recordAnswer,
    adjustDifficulty,
    endSession
  } = useAdaptiveLearning('mathematics', 'arithmetic');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  // Sample math questions
  const questions = [
    {
      question: 'What is 15 + 27?',
      options: ['40', '42', '45', '48'],
      correct: 1,
      explanation: '15 + 27 = 42',
      difficulty: 1
    },
    {
      question: 'What is 8 × 7?',
      options: ['54', '56', '58', '64'],
      correct: 1,
      explanation: '8 × 7 = 56',
      difficulty: 2
    }
  ];

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const startTime = Date.now() - 5000; // Simulate 5 seconds thinking time
    const responseTime = Date.now() - startTime;
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    
    setShowResult(true);
    
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    recordAnswer(isCorrect, responseTime);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
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
            <h1 className="text-4xl font-bold mb-4">Great work!</h1>
            <p className="text-xl">You scored {score} out of {questions.length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Session Complete!</h3>
            <p className="text-gray-300">Keep practicing to improve your math skills!</p>
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
        <MathHeader 
          score={score} 
          totalQuestions={questions.length}
          currentQuestion={currentQuestion}
          difficulty={difficulty}
          performanceMetrics={performanceMetrics}
          onDifficultyChange={handleDifficultyChange}
        />
        <MathQuestion
          question={questions[currentQuestion]}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          onAnswerSelect={handleAnswerSelect}
          onSubmit={handleSubmit}
          onNext={handleNext}
          isLastQuestion={currentQuestion === questions.length - 1}
        />
      </div>
    </div>
  );
};

export default MathematicsLearning;
