
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LessonHeaderProps {
  subject: string;
  skillArea: string;
  currentQuestion: number;
  totalQuestions: number;
  difficultyLevel: number;
  timeSpent: number;
  onBack: () => void;
}

const LessonHeader = ({
  subject,
  skillArea,
  currentQuestion,
  totalQuestions,
  difficultyLevel,
  timeSpent,
  onBack
}: LessonHeaderProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-400 hover:text-white hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tilbage
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-300">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeSpent)}</span>
          </div>
          <Badge variant="outline" className="bg-blue-600 text-white border-blue-600">
            Niveau {difficultyLevel}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white capitalize">{subject}</h2>
            <p className="text-gray-400 capitalize">{skillArea}</p>
          </div>
          <div className="text-right">
            <div className="text-white font-semibold">
              Spørgsmål {currentQuestion} af {totalQuestions}
            </div>
          </div>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </div>
  );
};

export default LessonHeader;
