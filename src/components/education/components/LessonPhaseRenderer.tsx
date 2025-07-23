
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle, ArrowLeft } from 'lucide-react';
import { LessonState } from '../contexts/UnifiedLessonContext';
import EnhancedLessonManager from './EnhancedLessonManager';

interface LessonPhaseRendererProps {
  lessonState: LessonState;
  onLessonStart: () => void;
  onLessonComplete: () => void;
  onLessonResume: () => void;
  onBackToProgram: () => void;
  subject?: string;
  skillArea?: string;
}

const LessonPhaseRenderer = ({
  lessonState,
  onLessonStart,
  
  onLessonResume,
  onBackToProgram,
  subject,
  skillArea
}: LessonPhaseRendererProps) => {
  switch (lessonState.phase) {
    case 'introduction':
      return (
        <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-gray-700">
          <CardContent className="p-8 text-center text-white">
            <h1 className="text-4xl font-bold mb-6">Ready to Learn?</h1>
            <p className="text-xl mb-8 text-gray-200">
              Your personalized lesson is ready to begin. This adaptive learning experience 
              will adjust to your pace and help you master new concepts effectively.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={onLessonStart}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      );

    case 'lesson':
      // Use the passed subject prop or fall back to detecting from URL
      const currentSubject = subject || (() => {
        const currentUrl = window.location.pathname;
        return currentUrl.includes('/mathematics') ? 'mathematics' : 
               currentUrl.includes('/english') ? 'english' :
               currentUrl.includes('/science') ? 'science' :
               currentUrl.includes('/music') ? 'music' :
               currentUrl.includes('/computer-science') ? 'computer-science' :
               currentUrl.includes('/creative-arts') ? 'creative-arts' : 'mathematics';
      })();
      
      const currentSkillArea = skillArea || 'grade-appropriate';
      
      return (
        <EnhancedLessonManager
          subject={currentSubject}
          skillArea={currentSkillArea}
          onBackToProgram={onBackToProgram}
        />
      );

    case 'paused':
      return (
        <Card className="bg-yellow-900 border-yellow-700">
          <CardContent className="p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Lesson Paused</h2>
            <p className="text-lg mb-6">Your progress has been saved. Ready to continue?</p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={onLessonResume}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Resume Lesson
              </Button>
              <Button
                onClick={onBackToProgram}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Program
              </Button>
            </div>
          </CardContent>
        </Card>
      );

    case 'completed':
      return (
        <Card className="bg-green-900 border-green-700">
          <CardContent className="p-8 text-center text-white">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Lesson Complete!</h2>
            <p className="text-lg mb-6">
              Excellent work! You've successfully completed your lesson.
              Your final score: {lessonState.score} points
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={onBackToProgram}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Daily Program
              </Button>
            </div>
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
};

export default LessonPhaseRenderer;
