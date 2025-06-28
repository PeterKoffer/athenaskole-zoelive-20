
import { useState, useEffect } from 'react';
import { ScenarioDefinition, ScenarioNode, ScenarioSession } from '@/types/scenario';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

export const useScenarioSession = (scenario: ScenarioDefinition) => {
  const [session, setSession] = useState<ScenarioSession | null>(null);
  const [currentNode, setCurrentNode] = useState<ScenarioNode | null>(null);
  const [score, setScore] = useState(0);
  
  const { speakAsNelie } = useUnifiedSpeech();

  // Initialize session
  useEffect(() => {
    const newSession: ScenarioSession = {
      sessionId: `session-${Date.now()}`,
      scenarioId: scenario.id,
      userId: 'test-user-123',
      currentNodeId: scenario.entryNodeId,
      visitedNodes: [],
      responses: {},
      timestamps: {
        startedAt: new Date(),
        lastActiveAt: new Date()
      },
      status: 'active',
      progress: {
        percentComplete: 0,
        nodesCompleted: 0,
        totalNodes: scenario.nodes.length,
        score: 0
      }
    };
    
    setSession(newSession);
    
    // Find and set the entry node
    const entryNode = scenario.nodes.find(node => node.id === scenario.entryNodeId);
    if (entryNode) {
      setCurrentNode(entryNode);
      // Auto-speak the initial content
      setTimeout(() => {
        speakAsNelie(entryNode.content, true, 'scenario-content');
      }, 1000);
    }
    
    console.log('🎭 Session initialized:', newSession);
  }, [scenario, speakAsNelie]);

  const updateSession = (updates: Partial<ScenarioSession>) => {
    if (session) {
      setSession({ ...session, ...updates });
    }
  };

  const moveToNextNode = (nextNodeId: string) => {
    const nextNode = scenario.nodes.find(node => node.id === nextNodeId);
    if (nextNode && session) {
      setCurrentNode(nextNode);
      
      // Update session progress
      const visitedNodes = [...session.visitedNodes, session.currentNodeId];
      const updatedSession: ScenarioSession = {
        ...session,
        currentNodeId: nextNodeId,
        visitedNodes,
        progress: {
          ...session.progress,
          nodesCompleted: visitedNodes.length,
          percentComplete: Math.round((visitedNodes.length / scenario.nodes.length) * 100),
          score
        },
        timestamps: {
          ...session.timestamps,
          lastActiveAt: new Date()
        }
      };
      setSession(updatedSession);
      
      // Auto-speak new content
      setTimeout(() => {
        speakAsNelie(nextNode.content, true, 'scenario-content');
      }, 500);
      
      console.log('➡️ Moving to next node:', nextNodeId);
    }
  };

  return {
    session,
    currentNode,
    score,
    setScore,
    updateSession,
    moveToNextNode
  };
};
