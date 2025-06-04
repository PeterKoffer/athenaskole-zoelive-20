
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';
import QuestionDisplay from './QuestionDisplay';
import LessonHeader from './LessonHeader';
import TopicExplanation from './TopicExplanation';
import { SessionData } from './SessionProvider';

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
  sessionData: SessionData;
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
    currentQuestion,
    questions,
    hasAnswered,
    selectedAnswer,
    isLoading,
    error,
    handleAnswerSelect,
    currentQuestionIndex,
    timeSpent,
    generateNextQuestion,
    sessionId,
    showResult
  } = sessionData;
  
  const hasInitialized = useRef(false);
  const [showExplanation, setShowExplanation] = useState(true);

  console.log('📚 SessionContent state:', {
    sessionId: !!sessionId,
    questionsLength: questions.length,
    currentQuestionIndex,
    isLoading,
    error: !!error,
    hasAnswered,
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
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="text-white border-gray-600 hover:bg-gray-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        
        <Card className="bg-red-900 border-red-700">
          <CardContent className="p-6 text-center text-white">
            <Brain className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Questions</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <Button onClick={() => generateNextQuestion()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show topic explanation first
  if (showExplanation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="border-gray-600 text-slate-950 bg-slate-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        
        <TopicExplanation
          subject={subject}
          skillArea={skillArea}
          gradeLevel={learningObjective?.difficulty_level}
          standardInfo={learningObjective ? {
            code: learningObjective.id,
            title: learningObjective.title,
            description: learningObjective.description
          } : undefined}
          onStartQuestions={handleStartQuestions}
        />
      </div>
    );
  }

  if (isLoading || !questions.length) {
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
                Nelie is Preparing Your Questions
              </h3>
              <p className="text-gray-300 mb-4">
                Creating personalized {subject} questions just for you...
              </p>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <Button onClick={() => generateNextQuestion()} className="mt-4 bg-lime-400 text-black hover:bg-lime-500">
                Generate First Question
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
        timeSpent={timeSpent}
        onBack={onBack}
        learningObjective={learningObjective}
      />

      <QuestionDisplay
        question={question.question}
        options={question.options}
        selectedAnswer={selectedAnswer}
        correctAnswer={question.correct}
        showResult={showResult || false}
        explanation={question.explanation}
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

export default SessionContent;
