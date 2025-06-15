
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityMiniGameProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const ActivityMiniGame = ({ activity, onActivityComplete }: ActivityMiniGameProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>{activity.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8 bg-gradient-to-b from-purple-900/20 to-pink-900/20 rounded-lg">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-bold text-white mb-4">Mini Game Challenge</h3>
          <p className="text-gray-300 mb-6">{activity.content.gameDescription}</p>
          <Button 
            onClick={() => onActivityComplete(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
          >
            Start Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityMiniGame;
