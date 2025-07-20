
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface UnifiedLessonManagerProps {
  subject: string;
  skillArea: string;
  studentName: string;
  onBackToProgram: () => void;
}

const UnifiedLessonManager = ({
  subject,
  skillArea,
  studentName,
  onBackToProgram
}: UnifiedLessonManagerProps) => {
  const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1).replace('-', ' ');

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToProgram}
            variant="outline"
            className="bg-white/90 border-gray-300 text-gray-700 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Training Ground
          </Button>
          
          <div className="text-white text-right">
            <h1 className="text-2xl font-bold">Hello, {studentName}!</h1>
            <p className="text-white/80">Learning {subjectName}</p>
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-gray-800">
              <BookOpen className="w-6 h-6 mr-3" />
              {subjectName} Lesson
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-6">📚</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your {subjectName} lesson is loading...
              </h2>
              <p className="text-gray-600 mb-6">
                We're preparing an interactive learning experience for {skillArea.replace('_', ' ')}.
              </p>
              
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnifiedLessonManager;
