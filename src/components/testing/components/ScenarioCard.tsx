
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface ScenarioCardProps {
  title: string;
  icon: React.ReactNode;
  objective: string;
  expectedDifficulty: string;
  simulation: string;
  onRun: () => void;
  isRunning: boolean;
  buttonText: string;
  buttonIcon: React.ReactNode;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({
  title,
  icon,
  objective,
  expectedDifficulty,
  simulation,
  onRun,
  isRunning,
  buttonText,
  buttonIcon
}) => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p><strong>Objective:</strong> {objective}</p>
          <p><strong>Expected Initial Difficulty:</strong> {expectedDifficulty}</p>
          <p><strong>Simulation:</strong> {simulation}</p>
        </div>
        
        <Button
          onClick={onRun}
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Running Scenario...
            </>
          ) : (
            <>
              {buttonIcon}
              {buttonText}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScenarioCard;
