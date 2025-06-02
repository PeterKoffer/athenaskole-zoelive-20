
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw, ArrowLeft, Target } from 'lucide-react';

export interface LessonCompleteProps {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
  onBack: () => void;
}

const LessonComplete = ({ score, totalQuestions, onRetry, onBack }: LessonCompleteProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent!', color: 'bg-green-600' };
    if (score >= 80) return { text: 'Great!', color: 'bg-green-500' };
    if (score >= 70) return { text: 'Good!', color: 'bg-yellow-500' };
    if (score >= 60) return { text: 'Pass', color: 'bg-yellow-600' };
    return { text: 'Try Again', color: 'bg-red-600' };
  };

  const scoreBadge = getScoreBadge(score);

  return (
    <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-purple-400">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Trophy className="w-16 h-16 text-yellow-400" />
        </div>
        <CardTitle className="text-2xl text-white">Session Complete!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className={`text-6xl font-bold ${getScoreColor(score)} mb-2`}>
            {score}%
          </div>
          <Badge className={`${scoreBadge.color} text-white text-lg px-4 py-2`}>
            {scoreBadge.text}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-lime-400">{totalQuestions}</div>
            <div className="text-gray-300 text-sm">Questions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-lime-400">
              {Math.round((score / 100) * totalQuestions)}
            </div>
            <div className="text-gray-300 text-sm">Correct</div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={onRetry}
            className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button 
            onClick={onBack}
            variant="outline"
            className="w-full border-gray-600 text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonComplete;
