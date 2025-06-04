
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface SimplifiedSessionHeaderProps {
  subject: string;
  skillArea: string;
  questionNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  getRecommendedDifficulty: () => number;
  onBack: () => void;
}

const SimplifiedSessionHeader = ({
  subject,
  skillArea,
  questionNumber,
  totalQuestions,
  correctAnswers,
  getRecommendedDifficulty,
  onBack
}: SimplifiedSessionHeaderProps) => {
  return (
    <CardHeader>
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
          <CardTitle className="text-white">
            {subject} - {skillArea}
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Question {questionNumber} of {totalQuestions} • Level {getRecommendedDifficulty()}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-gray-400 text-sm">Score</p>
          <p className="text-white font-semibold">{correctAnswers}/{questionNumber - 1}</p>
        </div>
      </div>
    </CardHeader>
  );
};

export default SimplifiedSessionHeader;
