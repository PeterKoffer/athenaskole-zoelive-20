
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles } from 'lucide-react';

const PuzzleQuestTriumph = () => {
  return (
    <Card className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 border-green-400 border-4">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-center">
          <CheckCircle className="w-8 h-8 mr-2 text-green-300 animate-bounce" />
          PUZZLE MASTERED!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8 space-y-6">
          <div className="text-8xl animate-bounce">🏆</div>
          
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-white">GENIUS LEVEL UNLOCKED!</h3>
            <p className="text-xl text-green-100">Puzzle solved with brilliant thinking!</p>
            
            <div className="bg-white/20 rounded-lg p-6 backdrop-blur">
              <div className="text-6xl mb-4">🧠</div>
              <h4 className="text-2xl font-bold text-white mb-2">MASTER PUZZLE SOLVER!</h4>
              <p className="text-green-200 text-lg">Your logical thinking is absolutely incredible!</p>
              
              <div className="mt-4 flex justify-center space-x-2">
                <Badge className="bg-yellow-500 text-black">🏅 Logic Master</Badge>
                <Badge className="bg-purple-500 text-white">🧩 Puzzle Champion</Badge>
                <Badge className="bg-blue-500 text-white">⚡ Quick Thinker</Badge>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              {['🎯', '💡', '🌟', '🚀'].map((emoji, index) => (
                <div 
                  key={index}
                  className="text-4xl animate-bounce"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="text-lg text-green-100 font-semibold">
                🎉 Advancing to next challenge... 🎉
              </div>
              <div className="flex justify-center">
                <Sparkles className="w-8 h-8 text-green-300 animate-spin" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PuzzleQuestTriumph;
