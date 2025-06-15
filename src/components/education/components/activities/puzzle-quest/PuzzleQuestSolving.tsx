
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Lightbulb } from 'lucide-react';

interface PuzzleQuestSolvingProps {
  hintsUsed: number;
  showHint: boolean;
  onShowHint: () => void;
}

const PuzzleQuestSolving = ({ hintsUsed, showHint, onShowHint }: PuzzleQuestSolvingProps) => {
  return (
    <Card className="bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 border-teal-400 border-2">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-center">
          <Brain className="w-6 h-6 mr-2 text-cyan-400 animate-pulse" />
          Puzzle Quest in Progress...
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8 space-y-6">
          <div className="text-8xl animate-spin">🧩</div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Your Brain is ON FIRE! 🔥</h3>
            <p className="text-xl text-teal-200">Brilliant thinking in action!</p>
            
            <div className="bg-cyan-800/50 rounded-lg p-6 border-2 border-cyan-400">
              <div className="text-4xl mb-2">🧠</div>
              <p className="text-lg text-cyan-200">Mental gears turning...</p>
              <p className="text-cyan-300">Logic circuits activating!</p>
            </div>
            
            {!showHint && (
              <Button 
                onClick={onShowHint}
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Need a Hint? ({3 - hintsUsed} remaining)
              </Button>
            )}
            
            {showHint && (
              <div className="bg-yellow-600/20 rounded-lg p-4 border-2 border-yellow-400 animate-pulse">
                <Lightbulb className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-yellow-200">Smart thinking! You're on the right track!</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((dot) => (
              <div 
                key={dot}
                className="w-3 h-3 bg-teal-400 rounded-full animate-bounce"
                style={{ animationDelay: `${dot * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PuzzleQuestSolving;
