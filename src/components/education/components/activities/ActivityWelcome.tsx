
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { LessonActivity } from '../EnhancedLessonContent';

interface ActivityWelcomeProps {
  activity: LessonActivity;
  timeRemaining: number;
  isNelieReady: boolean;
}

const ActivityWelcome = ({ activity, timeRemaining, isNelieReady }: ActivityWelcomeProps) => {
  return (
    <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-purple-400">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">👋</div>
          <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">{activity.title}</h2>
        <p className="text-xl text-purple-200 mb-6">{activity.content.message}</p>
        
        {isNelieReady && (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300">Nelie is speaking to you...</span>
          </div>
        )}
        
        <div className="text-purple-300">
          Lesson starting in {timeRemaining} seconds...
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityWelcome;
