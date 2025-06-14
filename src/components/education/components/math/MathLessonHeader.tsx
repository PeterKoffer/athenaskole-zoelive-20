
import { Button } from '@/components/ui/button';
import { Clock, Target } from 'lucide-react';
import UnifiedLessonNavigation from '../shared/UnifiedLessonNavigation';

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
  // Only show activity counter for interactive content
  const shouldShowActivityCounter = currentActivityType === 'interactive-game' || 
                                   currentActivityPhase === 'interactive-game';

  return (
    <div className="w-full bg-gradient-to-r from-purple-900 to-blue-900 border-b border-purple-400">
      <div className="w-full max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            onClick={onBackToProgram}
            className="text-white hover:bg-white/10"
          >
            Back to Program
          </Button>
          
          <div className="flex items-center space-x-6 text-white">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')} / {targetLessonLength}:00</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Score: {score}</span>
            </div>
            
            {shouldShowActivityCounter && (
              <div className="text-sm">
                Activity {currentActivityIndex + 1}
              </div>
            )}
          </div>
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
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">
            Mathematics with Nelie - {studentName}'s Lesson
            {correctStreak > 0 && (
              <span className="ml-2 text-green-400">🔥 {correctStreak} streak!</span>
            )}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default MathLessonHeader;
