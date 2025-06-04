
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSessionMetrics } from '@/hooks/useSessionMetrics';
import { useDiverseQuestionGeneration, Question } from '../hooks/useDiverseQuestionGeneration';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';
import QuestionDisplay from './QuestionDisplay';
import LessonHeader from './LessonHeader';

interface LearningSessionProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  totalQuestions: number;
  onBack: () => void;
  learningObjective?: {
    id: string;
    title: string;
    description: string;
    difficulty_level: number;
  };
}

const LearningSession = ({
  subject,
  skillArea,
  difficultyLevel,
  totalQuestions,
  onBack,
  learningObjective
}: LearningSessionProps) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasInitialized = useRef(false);

  const {
    questionsCompleted,
    correctAnswers,
    totalResponseTime,
    resetMetrics,
    updateMetrics
  } = useSessionMetrics();

  const { generateDiverseQuestion, saveQuestionHistory, isGenerating } = useDiverseQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel,
    userId: user?.id || '',
    gradeLevel: 6,
    standardsAlignment: null
  });

  const generateNextQuestion = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const newQuestion = await generateDiverseQuestion();
      setCurrentQuestion(newQuestion);
      setQuestions(prev => [...prev, newQuestion]);
      setSelectedAnswer(null);
      setHasAnswered(false);
      setShowResult(false);
    } catch (error) {
      console.error('Failed to generate question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && !hasInitialized.current) {
      hasInitialized.current = true;
      generateNextQuestion();
    }
  }, [user?.id]);

  const handleAnswerSelect = async (selectedIndex: number) => {
    if (hasAnswered || !currentQuestion) return;

    setSelectedAnswer(selectedIndex);
    setHasAnswered(true);
    setShowResult(true);

    const isCorrect = selectedIndex === currentQuestion.correct;
    updateMetrics(isCorrect, 30);

    // Save to history
    if (user?.id) {
      await saveQuestionHistory(
        currentQuestion,
        selectedIndex,
        isCorrect,
        30000
      );
    }

    // Auto-advance after 3 seconds
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        generateNextQuestion();
      }
    }, 3000);
  };

  if (isLoading && !currentQuestion) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="border-gray-600 text-slate-950 bg-slate-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <Brain className="w-12 h-12 text-lime-400 animate-pulse mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Preparing Your Questions
              </h3>
              <p className="text-gray-300 mb-4">
                Creating personalized {subject} questions just for you...
              </p>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="text-white border-gray-600 hover:bg-gray-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        
        <Card className="bg-yellow-900 border-yellow-700">
          <CardContent className="p-6 text-center text-white">
            <Brain className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Question Not Available</h3>
            <p className="text-yellow-300 mb-4">Let's generate your first question!</p>
            <Button onClick={generateNextQuestion} className="bg-yellow-500 text-black hover:bg-yellow-400">
              Generate Question Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="border-gray-600 text-slate-950 bg-slate-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <LessonHeader 
        subject={subject}
        skillArea={skillArea}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        difficultyLevel={difficultyLevel}
        timeSpent={totalResponseTime}
        onBack={onBack}
        learningObjective={learningObjective}
      />

      <QuestionDisplay
        question={currentQuestion.question}
        options={currentQuestion.options}
        selectedAnswer={selectedAnswer}
        correctAnswer={currentQuestion.correct}
        showResult={showResult}
        explanation={currentQuestion.explanation}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        onAnswerSelect={handleAnswerSelect}
        hasAnswered={hasAnswered}
        autoSubmit={true}
        subject={subject}
      />
    </div>
  );
};

export default LearningSession;
