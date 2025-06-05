
import { Card, CardContent } from '@/components/ui/card';
import { Star, BookOpen, Calculator, Microscope } from 'lucide-react';
import { LessonActivity } from '../EnhancedLessonContent';

interface ActivityWelcomeProps {
  activity: LessonActivity;
  timeRemaining: number;
  isNelieReady: boolean;
}

const ActivityWelcome = ({ activity, timeRemaining, isNelieReady }: ActivityWelcomeProps) => {
  const getSubjectIcon = (title: string) => {
    if (title.toLowerCase().includes('mathematics') || title.toLowerCase().includes('math')) {
      return Calculator;
    }
    if (title.toLowerCase().includes('english')) {
      return BookOpen;
    }
    if (title.toLowerCase().includes('science')) {
      return Microscope;
    }
    return Star;
  };

  const getSubjectEmoji = (title: string) => {
    if (title.toLowerCase().includes('mathematics') || title.toLowerCase().includes('math')) {
      return '🔢';
    }
    if (title.toLowerCase().includes('english')) {
      return '📚';
    }
    if (title.toLowerCase().includes('science')) {
      return '🔬';
    }
    return '⭐';
  };

  const SubjectIcon = getSubjectIcon(activity.title);
  const subjectEmoji = getSubjectEmoji(activity.title);

  return (
    <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-purple-400">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">{subjectEmoji}</div>
          <SubjectIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">{activity.title}</h2>
        <p className="text-xl text-purple-200 mb-6 leading-relaxed">{activity.content.message}</p>
        
        {isNelieReady && (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300">Nelie is welcoming you to class...</span>
          </div>
        )}
        
        <div className="text-purple-300">
          Class starting in {timeRemaining} seconds...
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityWelcome;
