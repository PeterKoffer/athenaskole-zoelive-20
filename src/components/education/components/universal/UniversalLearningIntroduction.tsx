
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, BookOpen } from 'lucide-react';

interface UniversalLearningIntroductionProps {
  subject: string;
  skillArea: string;
  onIntroductionComplete: () => void;
}

const UniversalLearningIntroduction = ({
  subject,
  skillArea,
  onIntroductionComplete
}: UniversalLearningIntroductionProps) => {
  const [isStarting, setIsStarting] = useState(false);

  const getSubjectEmoji = (subject: string): string => {
    const emojiMap: Record<string, string> = {
      'mathematics': '🧮',
      'science': '🔬',
      'english': '📚',
      'computer-science': '💻',
      'history-religion': '🏛️',
      'world-history-religions': '🕌',
      'geography': '🌎',
      'global-geography': '🗺️',
      'creative-arts': '🎨',
      'music': '🎵',
      'body-lab': '🫀',
      'mental-wellness': '🧠',
      'life-essentials': '🏠',
      'language-lab': '🌍'
    };
    return emojiMap[subject] || '📖';
  };

  const handleStart = () => {
    setIsStarting(true);
    setTimeout(onIntroductionComplete, 1000);
  };

  const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1).replace('-', ' ');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="text-8xl mb-4">
            {getSubjectEmoji(subject)}
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to {subjectName}
          </CardTitle>
          <p className="text-lg text-gray-600">
            Ready to explore {skillArea.replace('_', ' ')} with interactive lessons?
          </p>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <BookOpen className="w-5 h-5" />
              <span>Interactive lessons designed just for you</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <Play className="w-5 h-5" />
              <span>Engaging activities and real-time feedback</span>
            </div>
          </div>

          <Button
            onClick={handleStart}
            disabled={isStarting}
            className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isStarting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Starting your lesson...</span>
              </div>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Learning
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversalLearningIntroduction;
