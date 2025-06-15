
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTargetTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins.toString().padStart(2, '0')}:00`;
  };

  const shouldShowActivityCounter = currentActivityType === 'interactive-game' || 
                                   currentActivityPhase === 'interactive-game';

  return (
    <div className="w-full bg-gradient-to-r from-cyan-900/95 to-blue-900/95 border-b border-cyan-400/50 backdrop-blur-md">
      <div className="w-full max-w-6xl mx-auto px-4 py-3">
        {/* Scoreboard Widget */}
        <div className="bg-black/40 rounded-lg border border-green-400/30 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            {/* Left side - Back button */}
            <Button
              variant="ghost"
              onClick={onBackToProgram}
              className="text-white hover:bg-white/10 text-sm px-3 py-1"
            >
              Back to Program
            </Button>
            
            {/* Center - Main scoreboard display */}
            <div className="flex items-center space-x-8 bg-black/60 rounded-lg px-6 py-2 border border-green-400/20">
              {/* Time Display */}
              <div className="text-center">
                <div className="text-green-400 text-xs font-mono uppercase tracking-wider mb-1">TIME</div>
                <div className="text-green-400 text-2xl font-mono font-bold tracking-wider">
                  {formatTime(timeElapsed)}
                </div>
                <div className="text-green-400/60 text-xs font-mono">
                  / {formatTargetTime(targetLessonLength)}
                </div>
              </div>
              
              {/* Separator */}
              <div className="w-px h-12 bg-green-400/30"></div>
              
              {/* Score Display */}
              <div className="text-center">
                <div className="text-yellow-400 text-xs font-mono uppercase tracking-wider mb-1">SCORE</div>
                <div className="text-yellow-400 text-2xl font-mono font-bold tracking-wider">
                  {score.toString().padStart(3, '0')}
                </div>
                {correctStreak > 0 && (
                  <div className="text-orange-400 text-xs font-mono">
                    🔥 {correctStreak}
                  </div>
                )}
              </div>
              
              {/* Activity Counter (if applicable) */}
              {shouldShowActivityCounter && (
                <>
                  <div className="w-px h-12 bg-green-400/30"></div>
                  <div className="text-center">
                    <div className="text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">ACTIVITY</div>
                    <div className="text-cyan-400 text-2xl font-mono font-bold tracking-wider">
                      {(currentActivityIndex + 1).toString().padStart(2, '0')}
                    </div>
                    <div className="text-cyan-400/60 text-xs font-mono">
                      of {totalRealActivities.toString().padStart(2, '0')}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Right side - Navigation controls */}
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
          
          {/* Student name and lesson title */}
          <div className="text-center">
            <h1 className="text-lg font-bold text-white bg-black/30 rounded px-4 py-1 inline-block border border-cyan-400/20">
              English Language Arts with Nelie - {studentName}'s Lesson
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnglishLessonHeader;
