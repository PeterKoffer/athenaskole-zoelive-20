// src/components/simulations/ScenarioPlayer.tsx
import React, { useState, useEffect, useCallback } from 'react';
import type { ScenarioDefinition, ScenarioNode } from '@/types/scenario';
import stealthAssessmentService from '@/services/stealthAssessmentService'; // Import the service
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

interface ScenarioPlayerProps {
  scenario: ScenarioDefinition;
  onScenarioComplete?: (pathTaken: string[], finalNodeId: string) => void;
}

const ScenarioPlayer: React.FC<ScenarioPlayerProps> = ({ scenario, onScenarioComplete }) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(scenario.startNodeId);
  const [currentNode, setCurrentNode] = useState<ScenarioNode | null>(null);
  const [pathTaken, setPathTaken] = useState<string[]>([scenario.startNodeId]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | undefined>(undefined);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Log scenario start when component mounts or scenario changes
  useEffect(() => {
    stealthAssessmentService.logScenarioStart(
      {
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
      },
      'ScenarioPlayer'
    );
    // Reset state if scenario changes
    setCurrentNodeId(scenario.startNodeId);
    setPathTaken([scenario.startNodeId]);
    setIsCompleted(false);
    setFeedbackMessage(undefined);
  }, [scenario]);


  useEffect(() => {
    const node = scenario.nodes[currentNodeId];
    if (node) {
      setCurrentNode(node);
      stealthAssessmentService.logScenarioNodeView(
        {
          scenarioId: scenario.id,
          nodeId: node.id,
          nodeTitle: node.title,
        },
        'ScenarioPlayer'
      );

      if (node.isEndPoint) {
        setIsCompleted(true);
        if (onScenarioComplete) {
          onScenarioComplete(pathTaken, currentNodeId);
        }
        // Log scenario end
        stealthAssessmentService.logScenarioEnd(
          {
            scenarioId: scenario.id,
            scenarioTitle: scenario.title,
            reason: 'COMPLETED',
            finalNodeId: node.id,
            pathTaken: pathTaken,
          },
          'ScenarioPlayer'
        );
      }
    } else {
      console.error(`ScenarioPlayer: Node with ID '${currentNodeId}' not found in scenario '${scenario.id}'.`);
    }
  }, [currentNodeId, scenario, pathTaken, onScenarioComplete]);

  const handleDecision = useCallback((decisionText: string, nextNodeId: string, choiceIndex: number, feedback?: string) => {
    stealthAssessmentService.logScenarioDecision(
      {
        scenarioId: scenario.id,
        nodeId: currentNodeId,
        decisionText: decisionText,
        choiceIndex: choiceIndex,
        nextNodeId: nextNodeId,
      },
      'ScenarioPlayer'
    );

    setFeedbackMessage(feedback);
    setPathTaken(prevPath => [...prevPath, nextNodeId]);
    setCurrentNodeId(nextNodeId);
    // Optionally clear feedback after a delay
    if (feedback) {
      setTimeout(() => setFeedbackMessage(undefined), 3000);
    }
  }, []);

  if (!currentNode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Scenario data is missing or the current node could not be loaded.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>{currentNode.title || scenario.title}</CardTitle>
        {currentNode.title && <CardDescription>Scenario: {scenario.title}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-300 mb-4 whitespace-pre-line">
          {currentNode.description}
        </p>

        {feedbackMessage && (
          <div className="my-4 p-3 bg-blue-900/50 border border-blue-700 rounded-md text-blue-200">
            <p>{feedbackMessage}</p>
          </div>
        )}

        {isCompleted && (
          <div className="my-4 p-4 bg-green-900/50 border border-green-700 rounded-md text-green-200">
            <h3 className="font-semibold">Scenario Complete!</h3>
            <p>You have reached an endpoint: {currentNode.title || `Node ${currentNode.id}`}</p>
            {/* Optionally show full path or summary here */}
          </div>
        )}
      </CardContent>
      {!isCompleted && currentNode.decisionOptions && currentNode.decisionOptions.length > 0 && (
        <CardFooter className="flex flex-col space-y-2 items-stretch">
          {currentNode.decisionOptions.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleDecision(option.text, option.nextNodeId, index, option.feedback)}
              variant="outline"
              className="w-full"
            >
              {option.text}
            </Button>
          ))}
        </CardFooter>
      )}
       {!isCompleted && (!currentNode.decisionOptions || currentNode.decisionOptions.length === 0) && !currentNode.isEndPoint && (
         <CardFooter>
            <p className="text-sm text-yellow-400">This is an informational node with no further decisions. Consider marking as an endpoint or adding options.</p>
         </CardFooter>
       )}
    </Card>
  );
};

export default ScenarioPlayer;
