
import { ScenarioNode, ScenarioSession } from '@/types/scenario';

interface UseScenarioNavigationProps {
  currentNode: ScenarioNode | null;
  session: ScenarioSession | null;
  isCorrect: boolean;
  resetAnswering: () => void;
  moveToNextNode: (nodeId: string) => void;
  logNavigation: (fromNodeId: string, toNodeId: string | null) => void;
  handleComplete: () => void;
}

export const useScenarioNavigation = ({
  currentNode,
  session,
  isCorrect,
  resetAnswering,
  moveToNextNode,
  logNavigation,
  handleComplete
}: UseScenarioNavigationProps) => {

  const handleContinue = () => {
    if (!currentNode || !session) return;
    
    resetAnswering();
    
    // Determine next node based on branching logic
    let nextNodeId: string | null = null;
    
    if (currentNode.connections.branches) {
      const branch = currentNode.connections.branches.find(b => 
        (b.condition === 'correct' && isCorrect) ||
        (b.condition === 'incorrect' && !isCorrect)
      );
      nextNodeId = branch?.targetNodeId || currentNode.connections.fallback || null;
      
      logNavigation(currentNode.id, nextNodeId);
    } else {
      nextNodeId = currentNode.connections.next || null;
    }
    
    if (nextNodeId) {
      moveToNextNode(nextNodeId);
    } else {
      console.log('🎉 Scenario completed!');
      handleComplete();
    }
  };

  return {
    handleContinue
  };
};
