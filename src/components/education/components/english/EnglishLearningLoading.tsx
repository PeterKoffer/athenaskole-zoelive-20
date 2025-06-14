
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface EnglishLearningLoadingProps {
  studentName: string;
}

const EnglishLearningLoading = ({ studentName }: EnglishLearningLoadingProps) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <Card className="bg-gray-800 border-gray-700 max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">📚</div>
          <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Preparing Your English Lesson
          </h3>
          <p className="text-gray-300 mb-4">
            Nelie is setting up your personalized writing activities, {studentName}...
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnglishLearningLoading;
