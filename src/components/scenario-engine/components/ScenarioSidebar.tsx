
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
// Removed RobotAvatar
import { ScenarioNode } from '@/types/scenario';

interface ScenarioSidebarProps {
  currentNode: ScenarioNode;
  isSpeaking: boolean;
}

const ScenarioSidebar: React.FC<ScenarioSidebarProps> = ({
  currentNode,
  isSpeaking
}) => {
  return (
    <div className="lg:col-span-1">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Nelie - Your AI Tutor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <img src="/nelie.png" alt="Nelie avatar" className="w-24 h-24 rounded-full object-cover" />
            
            <div className="text-center">
              <p className="text-gray-300 text-sm mb-3">
                I'm here to help you learn! Click the speaker button to hear me read the content.
              </p>
              
              {currentNode.config?.allowHints && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Get Hint
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card className="bg-gray-800 border-gray-700 mt-4">
        <CardHeader>
          <CardTitle className="text-white text-sm">Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {(currentNode.educational?.learningObjectives ?? []).map((objective, index) => (
              <li key={index} className="text-gray-300 text-xs flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                {objective}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScenarioSidebar;
