
import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface InteractiveSimulationActivityProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const InteractiveSimulationActivity = ({ activity, onActivityComplete }: InteractiveSimulationActivityProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<string[]>([]);

  const simulationSteps = [
    "Initializing simulation...",
    "Processing data...",
    "Analyzing results...",
    "Generating insights...",
    "Simulation complete!"
  ];

  const handlePlayPause = useCallback(() => {
    if (!isRunning && step < simulationSteps.length - 1) {
      setIsRunning(true);
      const interval = setInterval(() => {
        setStep(prev => {
          if (prev < simulationSteps.length - 1) {
            setResults(prevResults => [...prevResults, simulationSteps[prev]]);
            return prev + 1;
          } else {
            setIsRunning(false);
            clearInterval(interval);
            return prev;
          }
        });
      }, 1500);
    } else {
      setIsRunning(false);
    }
  }, [isRunning, step, simulationSteps]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setStep(0);
    setResults([]);
  }, []);

  const handleComplete = useCallback(() => {
    onActivityComplete(true);
  }, [onActivityComplete]);

  return (
    <Card className="bg-gradient-to-br from-cyan-900 to-blue-900 border-cyan-400">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-4">{activity.title}</h3>
          <p className="text-cyan-200 text-lg mb-6">
            {activity.content?.scenario || "Interactive simulation to explore concepts"}
          </p>
          <Badge className="bg-cyan-600 text-white px-4 py-2">
            <Settings className="w-4 h-4 mr-2" />
            Interactive Simulation
          </Badge>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={handlePlayPause}
              className={`${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-3`}
            >
              {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isRunning ? 'Pause' : 'Start'} Simulation
            </Button>
            <Button
              onClick={handleReset}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>

          <div className="bg-black rounded-lg p-4 mb-4 min-h-[200px] font-mono text-green-400">
            <div className="text-green-300 mb-2">Simulation Output:</div>
            {results.map((result, index) => (
              <div key={index} className="mb-1">
                [{new Date().toLocaleTimeString()}] {result}
              </div>
            ))}
            {isRunning && (
              <div className="animate-pulse">
                [{new Date().toLocaleTimeString()}] {simulationSteps[step]}
              </div>
            )}
          </div>

          <div className="bg-blue-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Progress:</h4>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(step / (simulationSteps.length - 1)) * 100}%` }}
              />
            </div>
            <p className="text-cyan-200 text-sm mt-2">
              Step {step + 1} of {simulationSteps.length}
            </p>
          </div>
        </div>

        {step >= simulationSteps.length - 1 && (
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h4 className="text-xl text-white font-semibold mb-4">Simulation Complete!</h4>
            <Button
              onClick={handleComplete}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              Continue Learning
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveSimulationActivity;
