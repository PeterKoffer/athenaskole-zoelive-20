
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { ScenarioDefinition } from '@/types/scenario';

interface ScenarioCardProps {
  scenario: ScenarioDefinition;
  onStart: () => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onStart }) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Sample Scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{scenario.title}</h3>
            <p className="text-gray-300 mb-4">{scenario.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-4">
              <div>Subject: {scenario.educational.subject}</div>
              <div>Grade Level: {scenario.educational.gradeLevel}</div>
              <div>Difficulty: {scenario.educational.difficulty}/10</div>
              <div>Duration: ~{scenario.educational.estimatedDuration} mins</div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-white font-medium mb-2">Learning Outcomes:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {(scenario.educational.learningOutcomes ?? []).map((outcome, index) => (
                  <li key={index}>{outcome}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <Button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Scenario
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioCard;
