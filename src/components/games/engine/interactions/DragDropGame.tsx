
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Target } from 'lucide-react';
import { CurriculumGame } from '../../types/GameTypes';

interface DragDropGameProps {
  level: number;
  onLevelComplete: (score: number, perfect: boolean) => void;
  gameData: CurriculumGame;
}

interface DragItem {
  id: string;
  content: string;
  category: string;
  points: number;
}

interface DropZone {
  id: string;
  label: string;
  category: string;
  acceptedItems: string[];
}

const generateDragDropData = (gameData: CurriculumGame, level: number) => {
  const items: DragItem[] = [
    { id: '1', content: '🔴 Circle', category: 'shapes', points: 10 },
    { id: '2', content: '⬜ Square', category: 'shapes', points: 10 },
    { id: '3', content: '🔺 Triangle', category: 'shapes', points: 10 },
    { id: '4', content: '5 + 3', category: 'math', points: 15 },
    { id: '5', content: '7 - 2', category: 'math', points: 15 },
    { id: '6', content: '4 ×️ 2', category: 'math', points: 15 },
  ];

  const zones: DropZone[] = [
    { id: 'shapes', label: 'Shapes', category: 'shapes', acceptedItems: ['1', '2', '3'] },
    { id: 'math', label: 'Math Problems', category: 'math', acceptedItems: ['4', '5', '6'] },
  ];

  return { items: items.slice(0, 3 + level), zones };
};

const DragDropGame = ({ level, onLevelComplete, gameData }: DragDropGameProps) => {
  const [gameData2] = useState(() => generateDragDropData(gameData, level));
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [droppedItems, setDroppedItems] = useState<{ [zoneId: string]: DragItem[] }>({});
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const handleDragStart = useCallback((item: DragItem) => {
    setDraggedItem(item);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((zoneId: string) => {
    if (!draggedItem) return;

    const zone = gameData2.zones.find(z => z.id === zoneId);
    if (!zone) return;

    const isCorrect = zone.acceptedItems.includes(draggedItem.id);
    
    if (isCorrect) {
      setDroppedItems(prev => ({
        ...prev,
        [zoneId]: [...(prev[zoneId] || []), draggedItem]
      }));
      
      setScore(prev => prev + draggedItem.points);
      
      // Check if game is complete
      const totalDropped = Object.values(droppedItems).flat().length + 1;
      if (totalDropped >= gameData2.items.length) {
        setGameComplete(true);
        setTimeout(() => {
          onLevelComplete(score + draggedItem.points, true);
        }, 1500);
      }
    }
    
    setDraggedItem(null);
  }, [draggedItem, gameData2, droppedItems, score, onLevelComplete]);

  const availableItems = gameData2.items.filter(item => 
    !Object.values(droppedItems).flat().some(dropped => dropped.id === item.id)
  );

  return (
    <Card className="bg-gray-900 border-gray-700 max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center">
            <Target className="w-6 h-6 mr-2 text-purple-400" />
            Drag & Drop Challenge
          </span>
          <Badge className="bg-purple-600 text-white">
            Level {level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center text-white">
          <h2 className="text-xl font-bold mb-2">
            Drag items to their correct categories!
          </h2>
          <p className="text-gray-400">Score: {score} points</p>
        </div>

        {/* Available Items */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">Items to Sort:</h3>
          <div className="flex flex-wrap gap-3">
            {availableItems.map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-move hover:bg-blue-700 transition-colors select-none"
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>

        {/* Drop Zones */}
        <div className="grid md:grid-cols-2 gap-6">
          {gameData2.zones.map(zone => (
            <div
              key={zone.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(zone.id)}
              className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-6 min-h-32 hover:border-purple-400 transition-colors"
            >
              <h3 className="text-white font-bold text-lg mb-3 text-center">
                {zone.label}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {(droppedItems[zone.id] || []).map(item => (
                  <div
                    key={item.id}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {item.content}
                  </div>
                ))}
              </div>
              
              {(!droppedItems[zone.id] || droppedItems[zone.id].length === 0) && (
                <div className="text-gray-500 text-center italic">
                  Drop items here
                </div>
              )}
            </div>
          ))}
        </div>

        {gameComplete && (
          <div className="bg-green-900 border-green-500 border-2 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-2">Perfect! 🎉</h3>
            <p className="text-green-200">You sorted all items correctly!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DragDropGame;
