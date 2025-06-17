import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import ClassroomEnvironment from '../shared/ClassroomEnvironment';
import { getClassroomConfig } from '../shared/classroomConfigs';
import MathLessonHeader from './MathLessonHeader';
import ActivityQuestion from '../activities/ActivityQuestion';
import { LessonActivity } from '../types/LessonTypes';

interface MathLearningMainContentProps {
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
  onReadRequest: () => void;
  onStopSpeaking: () => void;
  onActivityComplete: (result: any) => void;
  onNavigateToActivity: (index: number) => void;
  canNavigateBack: boolean;
  canNavigateForward: boolean;
  isCurrentActivityCompleted: boolean;
}

const MathLearningMainContent = ({
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
  onActivityComplete,
  onNavigateToActivity,
  canNavigateBack,
  canNavigateForward,
  isCurrentActivityCompleted
}: MathLearningMainContentProps) => {
  const classroomConfig = getClassroomConfig("mathematics");

  const handleNavigateBack = () => {
    if (canNavigateBack && currentActivityIndex > 0) {
      onNavigateToActivity(currentActivityIndex - 1);
    }
  };

  const handleNavigateForward = () => {
    if (canNavigateForward && currentActivityIndex < totalRealActivities - 1) {
      onNavigateToActivity(currentActivityIndex + 1);
    }
  };

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Math Lesson Header with Scoreboard */}
        <MathLessonHeader
          studentName={studentName}
          timeElapsed={timeElapsed}
          targetLessonLength={targetLessonLength}
          score={score}
          currentActivityIndex={currentActivityIndex}
          totalRealActivities={totalRealActivities}
          correctStreak={correctStreak}
          onBackToProgram={onBackToProgram}
          onNavigateBack={handleNavigateBack}
          onNavigateForward={handleNavigateForward}
          canNavigateBack={canNavigateBack}
          canNavigateForward={canNavigateForward}
          currentActivityType={currentActivity?.type}
          currentActivityPhase={currentActivity?.phase}
        />

        {/* Speech Controls */}
        <div className="flex justify-center space-x-2">
          <Button
            onClick={isSpeaking ? onStopSpeaking : onReadRequest}
            variant="outline"
            size="sm"
            className="border-purple-400 text-purple-200 hover:bg-purple-700 bg-black/50"
          >
            {isSpeaking ? <Pause className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
            {isSpeaking ? 'Stop Nelie' : 'Ask Nelie to Read'}
          </Button>
          <Button
            onClick={onToggleMute}
            variant="outline"
            size="sm"
            className="border-gray-400 text-gray-300 hover:bg-gray-700 bg-black/50"
          >
            <VolumeX className="w-4 h-4 mr-2" />
            Mute
          </Button>
        </div>

        {/* Current Activity Content */}
        {currentActivity && (
          <Card className="bg-black/50 border-purple-400/50 backdrop-blur-sm">
            <CardContent className="p-8">
              {currentActivity.type === 'interactive-game' && currentActivity.content?.question ? (
                <ActivityQuestion
                  activity={currentActivity}
                  timeRemaining={Math.max(0, targetLessonLength * 60 - timeElapsed)}
                  onActivityComplete={(wasCorrect) => {
                    console.log('🎯 Math answer submitted:', wasCorrect);
                    onActivityComplete(wasCorrect);
                  }}
                />
              ) : (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">{currentActivity.title}</h3>
                  <div className="text-lg text-purple-200 mb-6">
                    {currentActivity.content?.text || 'Welcome to mathematics learning with Nelie!'}
                  </div>
                  
                  <div className="space-y-4">
                    <Button
                      onClick={() => onActivityComplete({ success: true, score: 100 })}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold px-6 py-3"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ClassroomEnvironment>
  );
};

export default MathLearningMainContent;
