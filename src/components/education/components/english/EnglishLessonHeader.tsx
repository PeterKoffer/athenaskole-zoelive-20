
import { Button } from '@/components/ui/button';
import { Clock, Star, Trophy } from 'lucide-react';
import UnifiedLessonNavigation from '../shared/UnifiedLessonNavigation';

interface EnglishLessonHeaderProps {
  studentName: string;
  timeElapsed: number;
  targetLessonLength: number;
  score: number;
  currentActivityIndex: number;
  totalRealActivities: number;
  correctStreak: number;
  onBackToProgram: () => void;
  onNavigateBack?: () => void;
  onNavigateForward?: () => void;
  canNavigateBack?: boolean;
  canNavigateForward?: boolean;
  currentActivityType?: string;
  currentActivityPhase?: string;
}

const EnglishLessonHeader = ({
  studentName,
  timeElapsed,
  targetLessonLength,
  score,
  currentActivityIndex,
  totalRealActivities,
  correctStreak,
  onBackToProgram,
  onNavigateBack,
  onNavigateForward,
  canNavigateBack = false,
  canNavigateForward = false,
  currentActivityType,
  currentActivityPhase
}: EnglishLessonHeaderProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTargetTime = (seconds: number) => {
    return Math.round(seconds / 60);
  };

  const progressPercentage = Math.min((timeElapsed / targetLessonLength) * 100, 100);

  return (
    <div className="w-full bg-gray-800 border-b border-gray-700">
      <div className="w-full max-w-4xl mx-auto px-4 py-4">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            onClick={onBackToProgram}
            className="border-gray-600 text-white bg-gray-700 hover:bg-gray-600"
          >
            Back to Program
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold text-white">English with Nelie</h1>
            <p className="text-gray-300 text-sm">Welcome {studentName}!</p>
          </div>
          
          <div className="w-24"></div> {/* Spacer for balance */}
        </div>

        {/* Lesson Navigation Arrows */}
        <div className="mb-4">
          <UnifiedLessonNavigation
            onBack={onNavigateBack || (() => {})}
            onForward={onNavigateForward}
            canGoBack={canNavigateBack}
            canGoForward={canNavigateForward}
            backLabel="Previous Step"
            forwardLabel="Next Step"
          />
        </div>

        {/* Progress and Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Time Progress */}
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-white text-sm font-medium">Time</span>
              </div>
              <span className="text-gray-300 text-sm">
                {formatTime(timeElapsed)} / {formatTargetTime(targetLessonLength)}min
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Activity Progress */}
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-medium">Progress</span>
              <span className="text-gray-300 text-sm">
                {currentActivityIndex + 1} / {totalRealActivities}
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentActivityIndex + 1) / totalRealActivities) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Score */}
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-white text-sm font-medium">Score</span>
              </div>
              <span className="text-yellow-400 font-semibold">{score}</span>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Trophy className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-white text-sm font-medium">Streak</span>
              </div>
              <span className="text-purple-400 font-semibold">{correctStreak}</span>
            </div>
          </div>
        </div>

        {/* Current Activity Indicator */}
        {currentActivityType && (
          <div className="mt-4 text-center">
            <span className="inline-block bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
              {currentActivityPhase?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Learning'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnglishLessonHeader;
