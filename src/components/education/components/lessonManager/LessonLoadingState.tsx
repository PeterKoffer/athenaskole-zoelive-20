
import { Card, CardContent } from '@/components/ui/card';
import { Clock, RefreshCw } from 'lucide-react';

interface LessonLoadingStateProps {
  subject: string;
}

const LessonLoadingState = ({ subject: _subject }: LessonLoadingStateProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-8 text-center">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">
              Generating Your Daily Lesson
            </h3>
            <p className="text-gray-400 text-lg">
              Creating a personalized lesson based on your progress and grade level...
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-lime-400 mt-4">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing your learning progress</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonLoadingState;
