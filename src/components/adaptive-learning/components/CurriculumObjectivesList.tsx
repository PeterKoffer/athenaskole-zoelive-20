
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from 'lucide-react';
import CurriculumObjectiveCard from './CurriculumObjectiveCard';

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

interface CurriculumObjectivesListProps {
  objectives: LearningObjective[];
  userProgress: Record<string, number>;
  isAuthenticated: boolean;
  onObjectiveSelect: (objective: LearningObjective) => void;
}

const CurriculumObjectivesList = ({ 
  objectives, 
  userProgress, 
  isAuthenticated, 
  onObjectiveSelect 
}: CurriculumObjectivesListProps) => {
  const getProgressForObjective = (objective: LearningObjective) => {
    return userProgress[objective.title] || 0;
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Book className="w-5 h-5 text-lime-400" />
          <span>Standards-Aligned Learning Objectives</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {objectives.map((objective) => {
          const progress = getProgressForObjective(objective);
          
          return (
            <CurriculumObjectiveCard
              key={objective.id}
              objective={objective}
              progress={progress}
              isAuthenticated={isAuthenticated}
              onClick={onObjectiveSelect}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};

export default CurriculumObjectivesList;
