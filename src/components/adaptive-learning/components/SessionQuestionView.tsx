
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import QuestionDisplay from './QuestionDisplay';
import LessonHeader from './LessonHeader';
import { Question } from '../hooks/useDiverseQuestionGeneration';

interface SessionQuestionViewProps {
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
  currentQuestion: Question;
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  showResult: boolean;
  hasAnswered: boolean;
  totalResponseTime: number;
  onAnswerSelect: (selectedIndex: number) => void;
}

const SessionQuestionView = ({
  subject,
  skillArea,
  difficultyLevel,
  totalQuestions,
  onBack,
  learningObjective,
  currentQuestion,
  currentQuestionIndex,
  selectedAnswer,
  showResult,
  hasAnswered,
  totalResponseTime,
  onAnswerSelect
}: SessionQuestionViewProps) => {
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
        onAnswerSelect={onAnswerSelect}
        hasAnswered={hasAnswered}
        autoSubmit={true}
        subject={subject}
      />
    </div>
  );
};

export default SessionQuestionView;
