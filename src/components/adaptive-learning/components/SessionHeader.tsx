
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { ArrowLeft, GraduationCap } from 'lucide-react';

interface SessionHeaderProps {
  onBack: () => void;
  gradeLevel?: number;
  subject: string;
  questionNumber: number;
  totalQuestions: number;
  standardCode?: string;
  correctAnswers: number;
  showResult: boolean;
  isGenerating: boolean;
  onRefresh: () => void;
}

const SessionHeader = ({
  onBack,
  gradeLevel,
  subject,
  questionNumber,
  totalQuestions,
  standardCode,
  correctAnswers,
  showResult,
  isGenerating,
  onRefresh
}: SessionHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      <div className="text-center">
        <CardTitle className="text-white flex items-center space-x-2">
          <GraduationCap className="w-5 h-5 text-lime-400" />
          <span>Grade {gradeLevel} - {subject.charAt(0).toUpperCase() + subject.slice(1)}</span>
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Question {questionNumber} of {totalQuestions}
        </p>
      </div>
      
      <div className="text-right">
        <p className="text-gray-400 text-sm">Score</p>
        <p className="text-white font-semibold">
          {correctAnswers}/{questionNumber - (showResult ? 0 : 1)}
        </p>
      </div>
    </div>
  );
};

export default SessionHeader;
