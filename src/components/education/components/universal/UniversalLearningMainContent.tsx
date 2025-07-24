
// @ts-nocheck
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, VolumeX, Clock, Star } from 'lucide-react';
import ClassroomEnvironment from '../shared/ClassroomEnvironment';
import { getClassroomConfig } from '../shared/classroomConfigs';
import EnhancedActivityRenderer from '../EnhancedActivityRenderer';
import { LessonActivity } from '../types/LessonTypes';

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
  currentActivity: LessonActivity | null;
  isSpeaking: boolean;
  onBackToProgram: () => void;
  onToggleMute: () => void;
  onReadRequest: (text: string) => void;
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
  const classroomConfig = getClassroomConfig(subject);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBackToProgram}
              className="flex items-center gap-2 text-white hover:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Training Ground
            </Button>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={isSpeaking ? onStopSpeaking : onToggleMute}
                className="text-white hover:text-gray-300"
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Progress Card */}
          <Card className="bg-black/20 border-white/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-white">
                  {studentName}'s {classroomConfig.subjectName} Session
                </h1>
                <div className="flex items-center space-x-4 text-white">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(timeElapsed)} / {formatTime(targetLessonLength)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{score} points</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="text-white">
                  <div className="text-2xl font-bold">{currentActivityIndex + 1}</div>
                  <div className="text-sm opacity-80">Activity</div>
                </div>
                <div className="text-white">
                  <div className="text-2xl font-bold">{totalRealActivities}</div>
                  <div className="text-sm opacity-80">Total Activities</div>
                </div>
                <div className="text-white">
                  <div className="text-2xl font-bold">{correctStreak}</div>
                  <div className="text-sm opacity-80">Correct Streak</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Current Activity */}
          {currentActivity && (
            <div className="space-y-4">
              <EnhancedActivityRenderer
                activity={currentActivity}
                onActivityComplete={onActivityComplete}
                score={score}
                isNelieReady={true}
              />
            </div>
          )}
        </div>
      </div>
    </ClassroomEnvironment>
  );
};

export default UniversalLearningMainContent;
