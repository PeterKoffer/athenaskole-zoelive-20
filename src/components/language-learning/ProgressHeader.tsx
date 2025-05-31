
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart } from "lucide-react";
import { Lesson } from "./types";

interface ProgressHeaderProps {
  hearts: number;
  xp: number;
  currentLesson: Lesson;
  currentQuestion: number;
  onBack: () => void;
}

const ProgressHeader = ({ hearts, xp, currentLesson, currentQuestion, onBack }: ProgressHeaderProps) => {
  const progressPercent = ((currentQuestion + 1) / currentLesson.questions.length) * 100;

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </Button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-white">{hearts}</span>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400">
              {xp} XP
            </Badge>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-white">
            <span>{currentLesson.title}</span>
            <span>{currentQuestion + 1} / {currentLesson.questions.length}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProgressHeader;
