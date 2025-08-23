
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, RotateCcw } from 'lucide-react';
import { CurriculumGame } from '../../types/GameTypes';

interface DrawingGameProps {
  level: number;
  onLevelComplete: (score: number, perfect: boolean) => void;
  gameData: CurriculumGame;
}

const DrawingGame = ({ level, onLevelComplete, gameData }: DrawingGameProps) => {
  void gameData;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#3B82F6');
  const [brushSize, setBrushSize] = useState(3);
  const [drawingComplete, setDrawingComplete] = useState(false);

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  
  const drawingPrompts = [
    "Draw a triangle",
    "Draw a house",
    "Draw a circle",
    "Draw a flower",
    "Draw a star"
  ];
  
  const currentPrompt = drawingPrompts[level % drawingPrompts.length];

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawingComplete(false);
  };

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
  };

  useState(() => {
    setTimeout(setupCanvas, 100);
  });

  const handleSubmitDrawing = () => {
    setDrawingComplete(true);
    // Award points for completing the drawing
    const score = 100 + (level * 20);
    setTimeout(() => {
      onLevelComplete(score, true);
    }, 2000);
  };

  return (
    <Card className="bg-gray-900 border-gray-700 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center">
            <Palette className="w-6 h-6 mr-2 text-pink-400" />
            Drawing Challenge
          </span>
          <Badge className="bg-pink-600 text-white">
            Level {level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            {currentPrompt}
          </h2>
          <p className="text-gray-400">Use your creativity and have fun!</p>
        </div>

        {/* Drawing Tools */}
        <div className="flex items-center justify-center space-x-4 bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm">Colors:</span>
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  currentColor === color ? 'border-white' : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm">Size:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-20"
            />
          </div>
          
          <Button
            onClick={clearCanvas}
            variant="outline"
            size="sm"
            className="text-white border-gray-600"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>

        {/* Drawing Canvas */}
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-2">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="border border-gray-300 rounded cursor-crosshair"
              style={{
                touchAction: 'none'
              }}
            />
          </div>
        </div>

        {!drawingComplete && (
          <div className="text-center">
            <Button
              onClick={handleSubmitDrawing}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 text-lg"
            >
              🎨 Submit Drawing
            </Button>
          </div>
        )}

        {drawingComplete && (
          <div className="bg-green-900 border-green-500 border-2 rounded-lg p-6 text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-2">Beautiful Creation! 🎉</h3>
            <p className="text-green-200">
              Your artistic skills are amazing! You've completed the drawing challenge.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DrawingGame;
