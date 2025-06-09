
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityIntroductionProps {
  activity: LessonActivity;
  timeRemaining: number;
  onContinue: () => void;
  isNelieReady: boolean;
}

const ActivityIntroduction = ({
  activity,
  timeRemaining,
  onContinue,
  isNelieReady
}: ActivityIntroductionProps) => {
  return (
    <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-gray-700 min-h-[500px]">
      <CardContent className="p-4 sm:p-6 md:p-8 text-center text-white flex flex-col justify-between min-h-[500px]">
        <div className="flex-1 flex flex-col justify-center space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2">
            {activity.title}
          </h2>
          
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 sm:p-6 backdrop-blur-sm mx-2">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-100">
              {activity.content.hook}
            </p>
          </div>
          
          {activity.content.realWorldExample && (
            <div className="bg-blue-800/30 border border-blue-600 rounded-lg p-3 sm:p-4 backdrop-blur-sm mx-2">
              <p className="text-sm sm:text-base text-blue-200">
                💡 {activity.content.realWorldExample}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4 mt-6 sm:mt-8 px-2">
          <div className="flex items-center justify-center space-x-2 text-gray-300 text-xs sm:text-sm">
            <Clock className="w-4 h-4" />
            <span>{Math.ceil(timeRemaining / 60)} minutes remaining in this phase</span>
          </div>
          
          {/* Properly centered and responsive Start Lesson button */}
          <div className="flex justify-center w-full">
            <Button
              onClick={onContinue}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg shadow-lg transform hover:scale-105 transition-all duration-200 w-full max-w-xs sm:max-w-sm md:w-auto"
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Start Lesson
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityIntroduction;
