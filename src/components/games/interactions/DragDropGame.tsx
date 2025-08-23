
import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { GameState, GameActions } from '../GameEngine';

interface DragDropItem {
  id: string;
  content: string;
  type: 'draggable' | 'dropzone';
  category?: string;
  value?: number;
  correctTarget?: string;
}

interface DragDropGameProps {
  gameState: GameState;
  gameActions: GameActions;
  items: DragDropItem[];
  instruction: string;
  onComplete: (success: boolean) => void;
}

const DragDropGame = ({ gameState, gameActions, items, instruction, onComplete }: DragDropGameProps) => {
  void gameState;
  const [draggedItem, setDraggedItem] = useState<DragDropItem | null>(null);
  const [droppedItems, setDroppedItems] = useState<Record<string, DragDropItem>>({});
  const [feedback, setFeedback] = useState<{ correct: string[], incorrect: string[] }>({ correct: [], incorrect: [] });
  const [gameCompleted, setGameCompleted] = useState(false);
  

  const draggableItems = items.filter(item => item.type === 'draggable');
  const dropZones = items.filter(item => item.type === 'dropzone');

  const handleDragStart = useCallback((e: React.DragEvent, item: DragDropItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', item.id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropZone: DragDropItem) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    // Check if item is correctly placed
    const isCorrect = draggedItem.correctTarget === dropZone.id || 
                     draggedItem.category === dropZone.category ||
                     draggedItem.value === dropZone.value;

    setDroppedItems(prev => ({
      ...prev,
      [dropZone.id]: draggedItem
    }));

    if (isCorrect) {
      setFeedback(prev => ({ 
        ...prev, 
        correct: [...prev.correct, dropZone.id] 
      }));
      gameActions.updateScore(20);
    } else {
      setFeedback(prev => ({ 
        ...prev, 
        incorrect: [...prev.incorrect, dropZone.id] 
      }));
      gameActions.updateScore(-5);
    }

    setDraggedItem(null);

    // Check if game is complete
    const totalDropZones = dropZones.length;
    const totalDropped = Object.keys(droppedItems).length + 1; // +1 for current drop
    
    if (totalDropped >= totalDropZones) {
      const correctCount = feedback.correct.length + (isCorrect ? 1 : 0);
      const successRate = correctCount / totalDropZones;
      
      setGameCompleted(true);
      
      if (successRate >= 0.7) {
        gameActions.addAchievement('Drag & Drop Master');
      }
      
      setTimeout(() => {
        onComplete(successRate >= 0.6);
      }, 2000);
    }
  }, [draggedItem, dropZones.length, droppedItems, feedback.correct.length, gameActions, onComplete]);

  const resetGame = () => {
    setDroppedItems({});
    setFeedback({ correct: [], incorrect: [] });
    setGameCompleted(false);
    setDraggedItem(null);
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Drag & Drop Challenge</h3>
            <p className="text-gray-300">{instruction}</p>
            <div className="flex justify-center space-x-4 mt-4">
              <Badge variant="outline" className="bg-green-900 text-green-400 border-green-400">
                Correct: {feedback.correct.length}
              </Badge>
              <Badge variant="outline" className="bg-red-900 text-red-400 border-red-400">
                Incorrect: {feedback.incorrect.length}
              </Badge>
            </div>
          </div>

          {/* Drop Zones */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {dropZones.map((dropZone) => {
              const droppedItem = droppedItems[dropZone.id];
              const isCorrect = feedback.correct.includes(dropZone.id);
              const isIncorrect = feedback.incorrect.includes(dropZone.id);
              
              return (
                <div
                  key={dropZone.id}
                  className={`
                    border-2 border-dashed p-4 h-24 rounded-lg flex items-center justify-center
                    transition-all duration-300 relative
                    ${isCorrect ? 'border-green-500 bg-green-900/20' : 
                      isIncorrect ? 'border-red-500 bg-red-900/20' : 
                      'border-gray-500 bg-gray-800/50 hover:border-blue-400'}
                  `}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dropZone)}
                >
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">{dropZone.content}</div>
                    {droppedItem && (
                      <div className="text-white font-medium">{droppedItem.content}</div>
                    )}
                    
                    {isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-400 absolute top-1 right-1" />
                    )}
                    {isIncorrect && (
                      <XCircle className="w-5 h-5 text-red-400 absolute top-1 right-1" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Draggable Items */}
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-white font-medium mb-3">Drag these items to the correct zones:</h4>
            <div className="flex flex-wrap gap-3 justify-center">
              {draggableItems.map((item) => {
                const isUsed = Object.values(droppedItems).some(dropped => dropped.id === item.id);
                
                if (isUsed) return null;
                
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    className={`
                      bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg cursor-grab
                      transition-all duration-200 hover:scale-105 active:cursor-grabbing
                      ${draggedItem?.id === item.id ? 'opacity-50' : ''}
                    `}
                  >
                    {item.content}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={resetGame}
              variant="outline"
              className="border-gray-600 text-white"
              disabled={gameCompleted}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {gameCompleted && (
            <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-400">
              <div className="text-blue-400 font-semibold">
                Game Complete! 
                {feedback.correct.length >= dropZones.length * 0.7 ? 
                  " Excellent work! 🎉" : 
                  " Good effort! Keep practicing! 💪"
                }
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DragDropGame;
