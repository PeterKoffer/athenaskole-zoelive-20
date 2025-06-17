
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MathLessonHeaderProps {
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

const MathLessonHeader = ({
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
}: MathLessonHeaderProps) => {
  const [displayTime, setDisplayTime] = useState(timeElapsed);

  useEffect(() => {
    setDisplayTime(timeElapsed);
  }, [timeElapsed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
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
              onClick={onNavigateBack}
              disabled={!canNavigateBack}
              className="border-gray-600 text-white bg-gray-700/50 hover:bg-gray-600/60 disabled:opacity-30 px-2 py-1"
            >
              <ArrowLeft className="w-3 h-3" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateForward}
              disabled={!canNavigateForward}
              className="border-gray-600 text-white bg-gray-700/50 hover:bg-gray-600/60 disabled:opacity-30 px-2 py-1"
            >
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Main scoreboard display - REMOVED ACTIVITIES COUNTER */}
        <div className="flex items-center justify-center space-x-8 bg-black/40 rounded-lg px-4 py-3 border border-green-400/20">
          {/* Time Display */}
          <div className="text-center">
            <div className="text-green-400 text-xs font-mono uppercase tracking-wider mb-1">TIME</div>
            <div className="text-green-400 text-xl font-mono font-bold tracking-wider">
              {formatTime(displayTime)}
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
            Mathematics with Nelie - {studentName}'s Lesson
          </h1>
        </div>
      </div>
    </div>
  );
};

export default MathLessonHeader;
