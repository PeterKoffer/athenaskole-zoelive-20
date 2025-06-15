
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';
import { LessonActivity } from '../../types/LessonTypes';

interface PuzzleQuestBriefingProps {
  activity: LessonActivity;
  onStartQuest: () => void;
}

const PuzzleQuestBriefing = ({ activity, onStartQuest }: PuzzleQuestBriefingProps) => {
  return (
    <Card className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-indigo-400 border-2">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-pink-400" />
            {activity.title}
          </span>
          <Badge className="bg-pink-500 text-white font-bold">PUZZLE QUEST!</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8 space-y-6">
          <div className="text-8xl animate-pulse">🧩</div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Mind-Bending Challenge Awaits!</h3>
            <p className="text-xl text-purple-200">{activity.content.puzzleDescription}</p>
            
            <div className="bg-purple-800/50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-purple-300 mb-2">Puzzle Master Tools:</h4>
              <div className="grid grid-cols-2 gap-2">
                <Badge className="bg-blue-600 text-white">🔍 Pattern Detector</Badge>
                <Badge className="bg-green-600 text-white">💡 Hint System</Badge>
                <Badge className="bg-orange-600 text-white">🎯 Logic Analyzer</Badge>
                <Badge className="bg-red-600 text-white">⚡ Quick Solver</Badge>
              </div>
            </div>
            
            <div className="bg-yellow-800/50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-yellow-300 mb-2">Puzzle Difficulty:</h4>
              <div className="flex justify-center">
                {[...Array(activity.content.difficulty || 3)].map((_, i) => (
                  <span key={i} className="text-2xl text-yellow-400">⭐</span>
                ))}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={onStartQuest}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 text-xl"
          >
            <Brain className="w-6 h-6 mr-2 animate-pulse" />
            BEGIN PUZZLE QUEST!
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PuzzleQuestBriefing;
