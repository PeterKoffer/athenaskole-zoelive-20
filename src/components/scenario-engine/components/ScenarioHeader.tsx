
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Volume2 } from 'lucide-react';
import { ScenarioDefinition, ScenarioSession } from '@/types/scenario';

interface ScenarioHeaderProps {
  scenario: ScenarioDefinition;
  session: ScenarioSession;
  score: number;
  isSpeaking: boolean;
  onExit: () => void;
  onSpeak: () => void;
}

const ScenarioHeader: React.FC<ScenarioHeaderProps> = ({
  scenario,
  session,
  score,
  isSpeaking,
  onExit,
  onSpeak
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button
          onClick={onExit}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-white">{scenario.title}</h1>
          <p className="text-sm text-gray-400">
            Progress: {session.progress.nodesCompleted}/{session.progress.totalNodes} • Score: {score}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          onClick={onSpeak}
          variant="ghost"
          size="sm"
          className={`${isSpeaking ? 'text-blue-400' : 'text-gray-400'} hover:text-white`}
        >
          <Volume2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ScenarioHeader;
