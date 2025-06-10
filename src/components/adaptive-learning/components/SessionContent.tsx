
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';
import { UnifiedSessionState } from '../contexts/UnifiedSessionContext';
import ExplanationPhase from './ExplanationPhase';
import SessionErrorState from './SessionErrorState';
import SessionLoadingState from './SessionLoadingState';
import SessionMainView from './SessionMainView';

interface SessionContentProps {
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
  sessionData: UnifiedSessionState;
}

const SessionContent = ({
  subject,
  skillArea,
  difficultyLevel,
  totalQuestions,
  onBack,
  learningObjective,
  sessionData
}: SessionContentProps) => {
  const {
    questions,
    isLoading,
    error,
    generateNextQuestion,
    sessionId,
    currentQuestionIndex
  } = sessionData;
  
  const hasInitialized = useRef(false);
  const [showExplanation, setShowExplanation] = useState(true);

  console.log('📚 SessionContent state:', {
    sessionId: !!sessionId,
    questionsLength: questions.length,
    currentQuestionIndex,
    isLoading,
    error: !!error,
    hasInitialized: hasInitialized.current,
    showExplanation
  });

  // Generate first question when explanation phase is complete
  useEffect(() => {
    if (sessionId && !questions.length && !isLoading && !hasInitialized.current && !showExplanation) {
      console.log('🚀 Starting first question generation after explanation');
      hasInitialized.current = true;
      generateNextQuestion();
    }
  }, [sessionId, questions.length, isLoading, generateNextQuestion, showExplanation]);

  const handleStartQuestions = () => {
    console.log('📖 Moving from explanation to questions phase');
    setShowExplanation(false);
  };

  if (error) {
    return (
      <SessionErrorState
        error={error}
        onBack={onBack}
        onRetry={() => generateNextQuestion()}
      />
    );
  }

  // Show topic explanation first
  if (showExplanation) {
    return (
      <ExplanationPhase
        subject={subject}
        skillArea={skillArea}
        gradeLevel={learningObjective?.difficulty_level}
        learningObjective={learningObjective}
        onBack={onBack}
        onStartQuestions={handleStartQuestions}
      />
    );
  }

  if (isLoading || !questions.length) {
    return (
      <SessionLoadingState
        subject={subject}
        onBack={onBack}
        onGenerate={() => generateNextQuestion()}
        showGenerateButton={!isLoading}
      />
    );
  }

  const question = questions[currentQuestionIndex];
  if (!question) {
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
            <Button onClick={() => generateNextQuestion()} className="bg-yellow-500 text-black hover:bg-yellow-400">
              Generate Question Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SessionMainView
      subject={subject}
      skillArea={skillArea}
      difficultyLevel={difficultyLevel}
      totalQuestions={totalQuestions}
      onBack={onBack}
      learningObjective={learningObjective}
      sessionData={sessionData}
    />
  );
};

export default SessionContent;
