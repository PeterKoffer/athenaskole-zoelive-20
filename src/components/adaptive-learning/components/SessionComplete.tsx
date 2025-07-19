
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, TrendingUp, RefreshCw } from 'lucide-react';

interface SessionCompleteProps {
  subject: string;
  skillArea: string;
  answers: number[];
  sessionQuestions: any[];
  totalQuestions: number;
  onRetry: () => void;
  onBack: () => void;
}

const SessionComplete = ({ 
  subject,
  skillArea,
  answers,
  totalQuestions,
  onRetry,
  onBack
}: SessionCompleteProps) => {
  const score = answers.reduce((sum, answer) => sum + answer, 0);
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return 'Excellent work!';
    if (percentage >= 80) return 'Great job!';
    if (percentage >= 70) return 'Good effort!';
    if (percentage >= 60) return 'Keep practicing!';
    return 'Let\'s try again!';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="text-center">
        <CardHeader>
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <CardTitle className="text-2xl">Session Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`text-4xl font-bold ${getScoreColor()}`}>
            {score}/{totalQuestions}
          </div>
          <div className={`text-2xl ${getScoreColor()}`}>
            {percentage}%
          </div>
          <p className="text-lg text-muted-foreground">
            {getPerformanceMessage()}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="text-center">
            <Star className="w-8 h-8 mx-auto text-yellow-500" />
            <CardTitle className="text-sm">Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-xl font-bold">{percentage}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <TrendingUp className="w-8 h-8 mx-auto text-blue-500" />
            <CardTitle className="text-sm">Progress</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-xl font-bold">+{Math.floor(percentage / 10)} XP</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Trophy className="w-8 h-8 mx-auto text-green-500" />
            <CardTitle className="text-sm">Subject</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-sm font-bold">{subject} - {skillArea}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 justify-center">
        <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        <Button onClick={onBack} className="flex items-center gap-2">
          Continue Learning
        </Button>
      </div>
    </div>
  );
};

export default SessionComplete;
