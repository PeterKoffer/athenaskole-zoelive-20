
import { Card, CardContent } from '@/components/ui/card';

interface UniversalLearningLoadingProps {
  subject: string;
  studentName: string;
}

const UniversalLearningLoading = ({ subject, studentName }: UniversalLearningLoadingProps) => {
  const getSubjectEmoji = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case 'music': return '🎵';
      case 'science': return '🔬';
      case 'computer-science': return '💻';
      case 'creative-arts': return '🎨';
      case 'english': return '📚';
      case 'mathematics': return '🔢';
      default: return '📖';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="bg-black/50 border-purple-400/50 backdrop-blur-sm max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4 animate-bounce">
            {getSubjectEmoji(subject)}
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Preparing Your {subject.charAt(0).toUpperCase() + subject.slice(1)} Lesson
          </h2>
          <p className="text-lg text-purple-200 mb-6">
            Hi {studentName}! Nelie is getting everything ready for an amazing learning adventure...
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversalLearningLoading;
