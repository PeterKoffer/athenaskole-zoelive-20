
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface NelieAvatarSectionProps {
  subject: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  isSpeaking: boolean;
  autoReadEnabled: boolean;
  onMuteToggle: () => void;
  onReadQuestion: () => void;
}

const NelieAvatarSection = ({
  subject,
  currentQuestionIndex,
  totalQuestions,
  isSpeaking,
  autoReadEnabled,
  onMuteToggle,
  onReadQuestion
}: NelieAvatarSectionProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isSpeaking) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking]);

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'mathematics': return 'from-blue-500 to-cyan-500';
      case 'english': return 'from-purple-500 to-violet-500';
      case 'science': return 'from-green-500 to-emerald-500';
      case 'music': return 'from-orange-500 to-yellow-500';
      case 'computer-science': return 'from-indigo-500 to-purple-500';
      case 'creative-arts': return 'from-pink-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSubjectEmoji = (subject: string) => {
    switch (subject) {
      case 'mathematics': return '🔢';
      case 'english': return '📚';
      case 'science': return '🔬';
      case 'music': return '🎵';
      case 'computer-science': return '💻';
      case 'creative-arts': return '🎨';
      default: return '📖';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Nelie Avatar */}
            <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${getSubjectColor(subject)} flex items-center justify-center ${isAnimating ? 'animate-pulse' : ''}`}>
              <div className="text-2xl">
                {getSubjectEmoji(subject)}
              </div>
              {isSpeaking && (
                <div className="absolute -inset-1 rounded-full border-2 border-lime-400 animate-ping"></div>
              )}
            </div>

            {/* Nelie Info */}
            <div>
              <h3 className="text-white font-semibold">
                Nelie - Your {subject.charAt(0).toUpperCase() + subject.slice(1)} Tutor
              </h3>
              <p className="text-gray-400 text-sm">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMuteToggle}
              className={`${autoReadEnabled ? 'text-lime-400 hover:text-lime-300' : 'text-gray-400 hover:text-gray-300'}`}
            >
              {autoReadEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onReadQuestion}
              className="text-blue-400 hover:text-blue-300"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NelieAvatarSection;
