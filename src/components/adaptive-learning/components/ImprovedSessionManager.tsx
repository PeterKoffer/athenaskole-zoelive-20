
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Pause, Square } from 'lucide-react';

interface SessionData {
  id: string;
  subject: string;
  startTime: Date;
  endTime?: Date;
  score: number;
  questionsAnswered: number;
}

interface ImprovedSessionManagerProps {
  subject: string;
  onSessionComplete: (data: SessionData) => void;
}

const ImprovedSessionManager = ({ subject, onSessionComplete }: ImprovedSessionManagerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(time => time + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setElapsedTime(0);
    setScore(0);
    setQuestionsAnswered(0);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    const sessionData: SessionData = {
      id: `session-${Date.now()}`,
      subject,
      startTime: new Date(Date.now() - elapsedTime * 1000),
      endTime: new Date(),
      score,
      questionsAnswered
    };
    
    setIsActive(false);
    setIsPaused(false);
    setElapsedTime(0);
    onSessionComplete(sessionData);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Session Manager - {subject}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-mono text-white mb-2">
            {formatTime(elapsedTime)}
          </div>
          <div className="text-gray-400">
            Score: {score} | Questions: {questionsAnswered}
          </div>
        </div>

        <div className="flex justify-center space-x-2">
          {!isActive ? (
            <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          ) : (
            <>
              <Button onClick={handlePause} variant="outline" className="border-gray-600">
                <Pause className="w-4 h-4 mr-2" />
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button onClick={handleStop} className="bg-red-600 hover:bg-red-700">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>

        {isActive && (
          <div className="text-center">
            <Button 
              onClick={() => {
                setScore(prev => prev + 10);
                setQuestionsAnswered(prev => prev + 1);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Simulate Correct Answer (+10 points)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImprovedSessionManager;
