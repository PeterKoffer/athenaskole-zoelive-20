
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface QuestionBadgeProps {
  estimatedTime: number;
}

const QuestionBadge = ({ estimatedTime }: QuestionBadgeProps) => {
  return (
    <Badge variant="outline" className="bg-purple-600 text-white border-purple-600">
      <Clock className="w-3 h-3 mr-1" />
      {estimatedTime}s
    </Badge>
  );
};

export default QuestionBadge;
