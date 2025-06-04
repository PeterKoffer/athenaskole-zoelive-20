
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GamepadIcon } from 'lucide-react';

interface ActivityGameProps {
  title: string;
  content: {
    text: string;
    answer?: string;
  };
  activityCompleted: boolean;
  onContinue: () => void;
}

const ActivityGame = ({
  title,
  content,
  activityCompleted,
  onContinue
}: ActivityGameProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <GamepadIcon className="w-6 h-6 text-lime-400 mr-2" />
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>

        <div className="space-y-6">
          <p className="text-lg text-white mb-6">
            {content.text}
          </p>
          <Button 
            onClick={onContinue} 
            className="bg-lime-500 hover:bg-lime-600 text-black font-semibold"
            disabled={activityCompleted}
          >
            I solved it!
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityGame;
