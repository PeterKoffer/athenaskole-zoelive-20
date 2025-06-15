
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityPuzzleProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const ActivityPuzzle = ({ activity, onActivityComplete }: ActivityPuzzleProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>{activity.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8 bg-gradient-to-b from-green-900/20 to-blue-900/20 rounded-lg">
          <div className="text-6xl mb-4">🧩</div>
          <h3 className="text-xl font-bold text-white mb-4">Puzzle Challenge</h3>
          <p className="text-gray-300 mb-6">{activity.content.puzzleDescription}</p>
          <Button 
            onClick={() => onActivityComplete(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            I Solved It!
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityPuzzle;
