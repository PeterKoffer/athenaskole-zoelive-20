
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface QuestionTimerProps {
  initialTime: number;
  onTimeUp: () => void;
  isActive: boolean;
  onReset?: () => void;
}

const QuestionTimer = ({ initialTime, onTimeUp, isActive, onReset }: QuestionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime, onReset]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onTimeUp]);

  const getTimeColor = () => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gray-800 border-gray-700 p-3 mb-4">
      <div className="flex items-center justify-center space-x-2">
        <Clock className={`w-5 h-5 ${getTimeColor()}`} />
        <span className="text-gray-300 text-sm">Time Remaining:</span>
        <span className={`text-lg font-mono font-bold ${getTimeColor()}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
    </Card>
  );
};

export default QuestionTimer;
