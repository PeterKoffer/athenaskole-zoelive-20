
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
}

interface GoalCardProps {
  goal: LearningGoal;
  isRecommended?: boolean;
  onSelect: (goal: LearningGoal) => void;
}

const GoalCard = ({ goal, isRecommended = false, onSelect }: GoalCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
  };

  const cardClass = isRecommended 
    ? "bg-purple-900/20 border border-purple-700 rounded-lg p-4"
    : "bg-gray-700 rounded-lg p-3";

  return (
    <div className={cardClass}>
      <div className="flex items-start justify-between mb-2">
        <h5 className={`font-medium flex-1 ${isRecommended ? 'text-purple-200' : 'text-white text-sm'}`}>
          {goal.title}
        </h5>
        {isRecommended && (
          <Badge className={`${getPriorityColor(goal.priority)} text-white ml-2 flex-shrink-0`}>
            Recommended
          </Badge>
        )}
      </div>
      
      <p className={`text-sm mb-3 ${isRecommended ? 'text-gray-300' : 'text-gray-400 text-xs'}`}>
        {goal.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>{getDifficultyStars(goal.difficulty)}</span>
          <span>{goal.estimatedTime} min</span>
        </div>
        
        {isRecommended ? (
          <Button
            onClick={() => onSelect(goal)}
            size="sm"
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            Start Learning
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          !isRecommended && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {goal.estimatedTime}m
              </Badge>
              <span className="text-xs text-gray-400">
                {getDifficultyStars(goal.difficulty)}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GoalCard;
