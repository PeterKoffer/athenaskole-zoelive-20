
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, BookOpen } from "lucide-react";
import AdaptiveDifficultyManager from '@/components/adaptive-learning/AdaptiveDifficultyManager';

interface CSLearningHeaderProps {
  performanceMetrics: {
    accuracy: number;
    averageTime: number;
    consecutiveCorrect: number;
    consecutiveIncorrect: number;
    totalAttempts: number;
  };
  onDifficultyChange: (newLevel: number, reason: string) => void;
}

const CSLearningHeader = ({ performanceMetrics, onDifficultyChange }: CSLearningHeaderProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800 mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Code className="w-6 h-6 text-purple-400" />
            <span>Computer Science & AI</span>
            <Badge variant="outline" className="bg-purple-900 text-purple-400 border-purple-400">
              New Class!
            </Badge>
          </CardTitle>
          
          <AdaptiveDifficultyManager 
            currentDifficulty={3}
            performanceMetrics={performanceMetrics}
            onDifficultyChange={onDifficultyChange}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-800/30">
          <div className="flex items-center space-x-2 mb-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Explore the Digital World</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Dive into programming, algorithms, AI, and computer science concepts through interactive 
            games and challenges designed to build critical computational thinking skills.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSLearningHeader;
