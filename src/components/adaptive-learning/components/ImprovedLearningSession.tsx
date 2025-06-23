
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuestionGeneration, Question } from '../hooks/useQuestionGeneration';
import { FallbackQuestionGenerator } from './FallbackQuestionGenerator';

interface ImprovedLearningSessionProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const ImprovedLearningSession = ({
  subject,
  skillArea,
  difficultyLevel,
  onBack
}: ImprovedLearningSessionProps) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [useFallback, setUseFallback] = useState(false);

  const { generateQuestion, isGenerating, error } = useQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel,
    userId: user?.id || 'anonymous'
  });

  console.log('📚 ImprovedLearningSession initialized:', {
    subject,
    skillArea,
    difficultyLevel,
    hasUser: !!user,
    useFallback,
    timestamp: new Date().toISOString()
  });

  // Generate first question on mount
  useEffect(() => {
    if (user?.id) {
      console.log('🚀 Attempting to generate first question...');
      handleGenerateQuestion();
    }
  }, [user?.id]);

  const handleGenerateQuestion = async () => {
    try {
      console.log('📝 Generating question via API...');
      const question = await generateQuestion([]);
      if (question) {
        setCurrentQuestion(question);
        setUseFallback(false);
        console.log('✅ API question generated successfully');
      } else {
        throw new Error('No question generated from API');
      }
    } catch (error) {
      console.warn('⚠️ API generation failed, using fallback:', error);
      const fallbackQuestion = FallbackQuestionGenerator.generateFallbackQuestion(
        subject,
        skillArea,
        difficultyLevel
      );
      setCurrentQuestion(fallbackQuestion);
      setUseFallback(true);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuestionCount(questionCount + 1);
    handleGenerateQuestion();
  };

  if (!user) {
    return (
      <Card className="bg-red-900 border-red-700 max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">Login Required</h3>
          <p className="text-red-300 mb-4">Please log in to start your lesson.</p>
          <Button onClick={onBack} className="bg-red-600 hover:bg-red-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isGenerating || !currentQuestion) {
    return (
      <Card className="bg-gray-900 border-gray-800 max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 text-blue-400 animate-pulse mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">
            {isGenerating ? 'Generating Question...' : 'Loading...'}
          </h3>
          <p className="text-gray-300 mb-4">
            Preparing your {subject} question
          </p>
          <Button onClick={onBack} variant="outline" className="border-gray-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" className="border-gray-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Program
        </Button>
        <div className="text-white">
          Question {questionCount + 1} | Score: {score}/{questionCount + 1}
        </div>
      </div>

      {/* Fallback Warning */}
      {useFallback && (
        <Card className="bg-yellow-900 border-yellow-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <p className="text-yellow-200 text-sm">
                Using practice questions (API unavailable)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-xl">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Answer Options */}
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  selectedAnswer === index
                    ? showExplanation
                      ? index === currentQuestion.correct
                        ? 'bg-green-900 border-green-600 text-green-100'
                        : 'bg-red-900 border-red-600 text-red-100'
                      : 'bg-blue-900 border-blue-600 text-blue-100'
                    : showExplanation && index === currentQuestion.correct
                    ? 'bg-green-900 border-green-600 text-green-100'
                    : 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Explanation:</h4>
              <p className="text-gray-300">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {!showExplanation ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-green-600 hover:bg-green-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Next Question
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprovedLearningSession;
