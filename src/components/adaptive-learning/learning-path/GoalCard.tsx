
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Star } from 'lucide-react';

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedTime: number;
  prerequisites: string[];
  completed: boolean;
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
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < difficulty ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <Card className={`bg-gray-700 border-gray-600 ${isRecommended ? 'ring-2 ring-purple-400' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h5 className="font-medium text-white">{goal.title}</h5>
          <span className={`text-xs font-semibold ${getPriorityColor(goal.priority)}`}>
            {goal.priority.toUpperCase()}
          </span>
        </div>
        
        <p className="text-gray-300 text-sm mb-3">{goal.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {getDifficultyStars(goal.difficulty)}
          </div>
          <div className="flex items-center text-gray-400 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {goal.estimatedTime}min
          </div>
        </div>
        
        <Button
          onClick={() => onSelect(goal)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          size="sm"
        >
          {isRecommended ? 'Start Learning' : 'Select Goal'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
