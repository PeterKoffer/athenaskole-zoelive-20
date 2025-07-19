
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FunctionalMathScoreboardProps {
  studentName: string;
  timeElapsed: number;
  score: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  correctStreak: number;
  questionsCompleted: number;
  onBackToProgram: () => void;
}

const FunctionalMathScoreboard = ({
  studentName,
  timeElapsed,
  score,
  currentQuestionIndex,
  totalQuestions,
  correctStreak,
  questionsCompleted,
  onBackToProgram
}: FunctionalMathScoreboardProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const accuracy = questionsCompleted > 0 ? Math.round((score / (questionsCompleted * 100)) * 100) : 0;

  return (
    <div className="w-full flex justify-center">
      <Card className="bg-black/70 border-purple-400/30 backdrop-blur-md max-w-4xl w-full">
        <CardContent className="p-4">
          {/* Top row with back button and student name */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={onBackToProgram}
              className="text-white hover:bg-white/10 text-sm px-3 py-1"
            >
              ← Back to Training Ground
            </Button>
            
            <h1 className="text-lg font-bold text-white">
              Mathematics with Nelie - {studentName}'s Session
            </h1>
            
            <div className="text-sm text-gray-300">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Main scoreboard display */}
          <div className="grid grid-cols-4 gap-4 bg-black/40 rounded-lg p-4 border border-green-400/20">
            {/* Time Display */}
            <div className="text-center">
              <div className="text-green-400 text-xs font-mono uppercase tracking-wider mb-1">TIME</div>
              <div className="text-green-400 text-xl font-mono font-bold tracking-wider">
                {formatTime(timeElapsed)}
              </div>
            </div>
            
            {/* Score Display */}
            <div className="text-center">
              <div className="text-yellow-400 text-xs font-mono uppercase tracking-wider mb-1">SCORE</div>
              <div className="text-yellow-400 text-xl font-mono font-bold tracking-wider">
                {score.toString().padStart(4, '0')}
              </div>
              {correctStreak > 0 && (
                <div className="text-orange-400 text-xs font-mono">
                  🔥 {correctStreak} streak
                </div>
              )}
            </div>

            {/* Accuracy Display */}
            <div className="text-center">
              <div className="text-blue-400 text-xs font-mono uppercase tracking-wider mb-1">ACCURACY</div>
              <div className="text-blue-400 text-xl font-mono font-bold tracking-wider">
                {accuracy}%
              </div>
            </div>

            {/* Progress Display */}
            <div className="text-center">
              <div className="text-purple-400 text-xs font-mono uppercase tracking-wider mb-1">PROGRESS</div>
              <div className="text-purple-400 text-xl font-mono font-bold tracking-wider">
                {currentQuestionIndex + 1}/{totalQuestions}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunctionalMathScoreboard;
