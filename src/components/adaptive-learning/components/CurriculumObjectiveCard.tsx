
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Award, Target } from 'lucide-react';

interface CurriculumStandard {
  id: string;
  code: string;
  name: string;
  description: string;
  grade_level: number;
  subject: string;
}

interface LearningObjective {
  id: string;
  title: string;
  description: string;
  difficulty_level: number;
  estimated_time_minutes: number;
  curriculum_standard: CurriculumStandard;
}

interface CurriculumObjectiveCardProps {
  objective: LearningObjective;
  progress: number;
  isAuthenticated: boolean;
  onClick: (objective: LearningObjective) => void;
}

const CurriculumObjectiveCard = ({ 
  objective, 
  progress, 
  isAuthenticated, 
  onClick 
}: CurriculumObjectiveCardProps) => {
  const isCompleted = progress >= 80;

  const getDifficultyColor = (level: number) => {
    if (level <= 3) return 'bg-green-500';
    if (level <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card 
      className={`bg-gray-800 border-gray-700 cursor-pointer transition-all hover:border-lime-400 ${isCompleted ? 'border-green-500' : ''}`}
      onClick={() => onClick(objective)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-white font-medium">{objective.title}</h3>
              {isCompleted && <Award className="w-4 h-4 text-green-400" />}
            </div>
            <p className="text-gray-400 text-sm mb-2">{objective.description}</p>
            <Badge variant="outline" className="text-xs">
              {objective.curriculum_standard.code}
            </Badge>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={getDifficultyColor(objective.difficulty_level)}>
              Level {objective.difficulty_level}
            </Badge>
            <div className="flex items-center text-gray-400 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {objective.estimated_time_minutes}min
            </div>
          </div>
        </div>
        
        {isAuthenticated && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Mastery Progress</span>
              <span className="text-white">{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
          <span className="text-gray-400 text-xs">
            Grade {objective.curriculum_standard.grade_level}
          </span>
          <Target className="w-4 h-4 text-lime-400" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CurriculumObjectiveCard;
