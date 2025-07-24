
// @ts-nocheck
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calculator } from "lucide-react";
import AdaptiveDifficultyManager from "@/components/adaptive-learning/AdaptiveDifficultyManager";

interface MathHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  difficulty: number;
  performanceMetrics: any;
  onDifficultyChange: (newLevel: number, reason: string) => void;
}

const MathHeader = ({
  currentQuestion,
  totalQuestions,
  score,
  difficulty,
  performanceMetrics,
  onDifficultyChange
}: MathHeaderProps) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            <span>Mathematics - Adaptive Learning</span>
          </div>
          <div className="text-lg font-semibold">
            Score: {score}/{totalQuestions}
          </div>
        </CardTitle>
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
            <AdaptiveDifficultyManager
              currentDifficulty={difficulty}
              onDifficultyChange={onDifficultyChange}
              performanceMetrics={performanceMetrics}
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default MathHeader;
