
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Brain } from 'lucide-react';

interface LessonCompleteProps {
  score: number;
  totalQuestions: number;
  onContinue: () => void;
}

const LessonComplete = ({ score, totalQuestions, onContinue }: LessonCompleteProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getPerformanceMessage = () => {
    if (percentage >= 80) return { message: "Excellent work! 🌟", color: "text-green-400" };
    if (percentage >= 60) return { message: "Good job! 👍", color: "text-blue-400" };
    if (percentage >= 40) return { message: "Keep practicing! 💪", color: "text-yellow-400" };
    return { message: "Don't give up! 🎯", color: "text-orange-400" };
  };

  const performance = getPerformanceMessage();

  return (
    <Card className="bg-gradient-to-br from-purple-900 to-blue-900 border-purple-500">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2 text-white">
          <Brain className="w-6 h-6 text-lime-400" />
          <span>AI Lesson Complete!</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="relative">
          <div className="text-6xl mb-4">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Star className="w-8 h-8 text-yellow-300 animate-pulse" />
          </div>
        </div>
        
        <div>
          <div className="text-4xl font-bold text-white mb-2">
            {score}/{totalQuestions}
          </div>
          <div className="text-xl text-gray-300 mb-1">
            {percentage}% Correct
          </div>
          <div className={`text-lg font-semibold ${performance.color}`}>
            {performance.message}
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Lesson Summary</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p>• Completed {totalQuestions} AI-generated questions</p>
            <p>• Achieved {percentage}% accuracy</p>
            <p>• Adaptive difficulty maintained engagement</p>
          </div>
        </div>

        <Button 
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-black font-semibold"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Continue Learning
        </Button>
      </CardContent>
    </Card>
  );
};

export default LessonComplete;
