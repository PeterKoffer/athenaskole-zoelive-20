
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import QuestionDisplay from './QuestionDisplay';
import LessonHeader from './LessonHeader';
import { SessionData } from './SessionProvider';

interface SessionMainViewProps {
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

const SessionMainView = ({
  subject,
  skillArea,
  difficultyLevel,
  totalQuestions,
  onBack,
  learningObjective,
  sessionData
}: SessionMainViewProps) => {
  const {
    currentQuestion,
    questions,
    selectedAnswer,
    currentQuestionIndex,
    timeSpent,
    showResult,
    hasAnswered,
    handleAnswerSelect
  } = sessionData;

  const question = questions[currentQuestionIndex];

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

export default SessionMainView;
