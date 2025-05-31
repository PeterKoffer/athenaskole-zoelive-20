
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock, Pause, Play, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SessionTimerProps {
  recommendedDuration: number; // in minutes
  onTimeUp?: () => void;
  onBreakSuggested?: () => void;
  isPaused?: boolean;
  onPauseToggle?: (paused: boolean) => void;
}

const SessionTimer = ({ 
  recommendedDuration, 
  onTimeUp, 
  onBreakSuggested, 
  isPaused = false,
  onPauseToggle 
}: SessionTimerProps) => {
  const { toast } = useToast();
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(true);
  const [breakSuggested, setBreakSuggested] = useState(false);

  const recommendedSeconds = recommendedDuration * 60;
  const progressPercent = Math.min((timeElapsed / recommendedSeconds) * 100, 100);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          
          // Check for break suggestion at 75% of recommended time
          if (!breakSuggested && newTime >= recommendedSeconds * 0.75) {
            setBreakSuggested(true);
            toast({
              title: "Break Time Soon! 🕐",
              description: "Consider taking a break in a few minutes.",
            });
            if (onBreakSuggested) {
              onBreakSuggested();
            }
          }

          // Check if recommended time is up
          if (newTime >= recommendedSeconds && onTimeUp) {
            toast({
              title: "Recommended Time Complete! ✅",
              description: "Great job! You can continue or take a break.",
            });
            onTimeUp();
          }

          return newTime;
        });
      }, 1000);
    } else if (!isActive) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, recommendedSeconds, breakSuggested, onTimeUp, onBreakSuggested, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePauseToggle = () => {
    const newPaused = !isPaused;
    if (onPauseToggle) {
      onPauseToggle(newPaused);
    }
  };

  const handleReset = () => {
    setTimeElapsed(0);
    setBreakSuggested(false);
    setIsActive(true);
  };

  const getStatusColor = () => {
    if (timeElapsed >= recommendedSeconds) return 'text-green-400';
    if (timeElapsed >= recommendedSeconds * 0.75) return 'text-yellow-400';
    return 'text-blue-400';
  };

  const getProgressColor = () => {
    if (timeElapsed >= recommendedSeconds) return 'bg-green-500';
    if (timeElapsed >= recommendedSeconds * 0.75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">Session Timer</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePauseToggle}
              className="border-gray-600 text-white bg-gray-700 hover:bg-gray-600"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="border-gray-600 text-white bg-gray-700 hover:bg-gray-600"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-lg font-mono ${getStatusColor()}`}>
              {formatTime(timeElapsed)}
            </span>
            <span className="text-sm text-gray-400">
              / {formatTime(recommendedSeconds)}
            </span>
          </div>
          
          <Progress 
            value={progressPercent} 
            className="h-2"
          />
          
          <div className="text-xs text-gray-400 text-center">
            {timeElapsed >= recommendedSeconds 
              ? "Great work! You can continue or take a break"
              : `${Math.ceil((recommendedSeconds - timeElapsed) / 60)} min until break suggestion`
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionTimer;
