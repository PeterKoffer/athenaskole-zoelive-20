
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ActivityExplanationProps {
  title: string;
  content: {
    text: string;
    interactions?: string[];
  };
  activityCompleted: boolean;
  onContinue: () => void;
}

const ActivityExplanation = ({
  title,
  content,
  activityCompleted,
  onContinue
}: ActivityExplanationProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
        
        <div className="space-y-4">
          <p className="text-lg text-gray-300 leading-relaxed">
            {content.text}
          </p>
          <Button 
            onClick={onContinue} 
            className="bg-lime-500 hover:bg-lime-600 text-black font-semibold"
            disabled={activityCompleted}
          >
            Continue Lesson
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityExplanation;
