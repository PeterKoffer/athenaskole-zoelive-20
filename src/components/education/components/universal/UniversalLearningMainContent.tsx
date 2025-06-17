
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Volume2, VolumeX, Clock } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';
import UniversalLessonTemplate from '../../templates/UniversalLessonTemplate';

interface UniversalLearningMainContentProps {
  subject: string;
  skillArea: string;
  studentName: string;
  timeElapsed: number;
  targetLessonLength: number;
  score: number;
  currentActivityIndex: number;
  totalRealActivities: number;
  correctStreak: number;
  currentActivity: LessonActivity;
  isSpeaking: boolean;
  onBackToProgram: () => void;
  onToggleMute: () => void;
  onReadRequest: () => void;
  onStopSpeaking: () => void;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const UniversalLearningMainContent = ({
  subject,
  skillArea,
  studentName,
  timeElapsed,
  targetLessonLength,
  score,
  currentActivityIndex,
  totalRealActivities,
  correctStreak,
  currentActivity,
  isSpeaking,
  onBackToProgram,
  onToggleMute,
  onReadRequest,
  onStopSpeaking,
  onActivityComplete
}: UniversalLearningMainContentProps) => {
  const progress = Math.round(((currentActivityIndex + 1) / totalRealActivities) * 100);
  const timeRemaining = Math.max(0, targetLessonLength - timeElapsed);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-black/50 border-purple-400/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={onBackToProgram}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
                <div className="text-white">
                  <h1 className="text-xl font-bold">
                    {subject.charAt(0).toUpperCase() + subject.slice(1)} Learning
                  </h1>
                  <p className="text-sm text-gray-300">Welcome, {studentName}!</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-white">
                <div className="text-center">
                  <div className="text-sm text-gray-300">Progress</div>
                  <div className="font-bold">{progress}%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-300">Score</div>
                  <div className="font-bold">{score}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-300">Time Left</div>
                  <div className="font-bold flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(timeRemaining)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Use Universal Lesson Template */}
        <UniversalLessonTemplate
          subject={subject}
          skillArea={skillArea}
          studentName={studentName}
          onComplete={() => onActivityComplete(true)}
          onBack={onBackToProgram}
        />

        {/* Controls */}
        <Card className="bg-black/50 border-purple-400/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={onToggleMute}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isSpeaking ? 'Mute' : 'Unmute'}
              </Button>
              
              <Button
                onClick={isSpeaking ? onStopSpeaking : onReadRequest}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                {isSpeaking ? 'Stop Reading' : 'Ask Nelie to Read'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UniversalLearningMainContent;
