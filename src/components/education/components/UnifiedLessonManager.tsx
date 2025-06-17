
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause, ArrowLeft, ArrowRight } from 'lucide-react';
import ClassroomEnvironment from './shared/ClassroomEnvironment';
import { getClassroomConfig } from './shared/classroomConfigs';
import StableEnhancedActivityRenderer from './StableEnhancedActivityRenderer';
import { useUnifiedLessonTemplate } from './hooks/useUnifiedLessonTemplate';

interface UnifiedLessonManagerProps {
  subject: string;
  skillArea: string;
  studentName?: string;
  onBackToProgram: () => void;
}

const UnifiedLessonManager = ({
  subject,
  skillArea,
  studentName = 'Student',
  onBackToProgram
}: UnifiedLessonManagerProps) => {
  const classroomConfig = getClassroomConfig(subject);
  
  const {
    currentActivityIndex,
    currentActivity,
    totalRealActivities,
    timeElapsed,
    score,
    correctStreak,
    targetLessonLength,
    isInitializing,
    isCurrentActivityCompleted,
    canNavigateForward,
    canNavigateBack,
    handleActivityComplete,
    handleReadRequest,
    isSpeaking,
    toggleMute,
    setCurrentActivityIndex
  } = useUnifiedLessonTemplate({
    subject,
    skillArea,
    onLessonComplete: onBackToProgram
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNavigateBack = () => {
    if (canNavigateBack && currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1);
    }
  };

  const handleNavigateForward = () => {
    if (canNavigateForward && currentActivityIndex < totalRealActivities - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
    }
  };

  if (isInitializing || !currentActivity) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-lg">Preparing your {subject} lesson...</p>
          </div>
        </div>
      </ClassroomEnvironment>
    );
  }

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Unified Header with Scoreboard */}
        <div className="w-full flex justify-center py-4">
          <div className="bg-black/60 rounded-xl border border-purple-400/30 backdrop-blur-md p-4 max-w-2xl">
            {/* Top row with back button and navigation */}
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                onClick={onBackToProgram}
                className="text-white hover:bg-white/10 text-sm px-3 py-1"
              >
                Back to Program
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNavigateBack}
                  disabled={!canNavigateBack}
                  className="border-gray-600 text-white bg-gray-700/50 hover:bg-gray-600/60 disabled:opacity-30 px-2 py-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNavigateForward}
                  disabled={!canNavigateForward}
                  className="border-gray-600 text-white bg-gray-700/50 hover:bg-gray-600/60 disabled:opacity-30 px-2 py-1"
                >
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Main scoreboard display */}
            <div className="flex items-center justify-center space-x-8 bg-black/40 rounded-lg px-4 py-3 border border-green-400/20">
              {/* Time Display */}
              <div className="text-center">
                <div className="text-green-400 text-xs font-mono uppercase tracking-wider mb-1">TIME</div>
                <div className="text-green-400 text-xl font-mono font-bold tracking-wider">
                  {formatTime(timeElapsed)}
                </div>
              </div>
              
              {/* Separator */}
              <div className="w-px h-10 bg-green-400/30"></div>
              
              {/* Score Display */}
              <div className="text-center">
                <div className="text-yellow-400 text-xs font-mono uppercase tracking-wider mb-1">SCORE</div>
                <div className="text-yellow-400 text-xl font-mono font-bold tracking-wider">
                  {score.toString().padStart(3, '0')}
                </div>
                {correctStreak > 0 && (
                  <div className="text-orange-400 text-xs font-mono">
                    🔥 {correctStreak}
                  </div>
                )}
              </div>
            </div>
            
            {/* Student name and lesson title */}
            <div className="text-center mt-3">
              <h1 className="text-sm font-semibold text-white bg-black/30 rounded px-3 py-1 inline-block border border-purple-400/20">
                {subject.charAt(0).toUpperCase() + subject.slice(1)} with Nelie - {studentName}'s Lesson
              </h1>
            </div>
          </div>
        </div>

        {/* Speech Controls */}
        <div className="flex justify-center space-x-2">
          <Button
            onClick={isSpeaking ? () => {} : handleReadRequest}
            variant="outline"
            size="sm"
            className="border-purple-400 text-purple-200 hover:bg-purple-700 bg-black/50"
          >
            {isSpeaking ? <Pause className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
            {isSpeaking ? 'Nelie is Speaking' : 'Ask Nelie to Read'}
          </Button>
          <Button
            onClick={toggleMute}
            variant="outline"
            size="sm"
            className="border-gray-400 text-gray-300 hover:bg-gray-700 bg-black/50"
          >
            <VolumeX className="w-4 h-4 mr-2" />
            Toggle Mute
          </Button>
        </div>

        {/* Current Activity Content */}
        <Card className="bg-black/50 border-purple-400/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <StableEnhancedActivityRenderer
              activity={currentActivity}
              onActivityComplete={handleActivityComplete}
              isNelieReady={true}
            />
          </CardContent>
        </Card>
      </div>
    </ClassroomEnvironment>
  );
};

export default UnifiedLessonManager;
