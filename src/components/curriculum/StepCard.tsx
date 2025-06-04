
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, CheckCircle, Clock, BookOpen, Play } from 'lucide-react';
import { CurriculumStep } from '@/types/curriculum';

interface StepCardProps {
  step: CurriculumStep;
  progressCount: number;
  totalCurriculums: number;
  onStepSelect: (step: CurriculumStep) => void;
}

const StepCard = ({ step, progressCount, totalCurriculums, onStepSelect }: StepCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const progressPercentage = totalCurriculums > 0 ? (progressCount / totalCurriculums) * 100 : 0;

  return (
    <Card className={`bg-gray-800 border-gray-700 ${step.isLocked ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
              {step.stepNumber}
            </div>
            {step.isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
            {step.isLocked && <Lock className="w-5 h-5 text-gray-400" />}
          </div>
          <Badge className={`${getDifficultyColor(step.difficulty)} text-white`}>
            {step.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-white text-lg">{step.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-400 text-sm">{step.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{step.estimatedTime} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>{totalCurriculums} curriculums</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-white">{progressCount}/{totalCurriculums}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Button
          onClick={() => onStepSelect(step)}
          disabled={step.isLocked}
          className={`w-full ${
            step.isLocked 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {step.isLocked ? (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Locked
            </>
          ) : step.isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Review
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Learning
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StepCard;
