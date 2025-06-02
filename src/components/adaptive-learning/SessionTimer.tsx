
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Play, Pause } from 'lucide-react';

export interface SessionTimerProps {
  onTimeUp?: () => void;
  recommendedDuration?: number; // in minutes
}

const SessionTimer = ({ onTimeUp, recommendedDuration = 20 }: SessionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(recommendedDuration * 60); // Convert to seconds
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            if (onTimeUp) {
              onTimeUp();
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / (recommendedDuration * 60)) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  return (
    <Card className="bg-gray-800 border-gray-700 p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className={`w-5 h-5 ${getTimeColor()}`} />
          <span className="text-gray-300 text-sm">Session Time</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`text-lg font-mono font-bold ${getTimeColor()}`}>
            {formatTime(timeLeft)}
          </span>
          
          <button
            onClick={toggleTimer}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
          >
            {isActive ? (
              <Pause className="w-4 h-4 text-gray-400" />
            ) : (
              <Play className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default SessionTimer;
