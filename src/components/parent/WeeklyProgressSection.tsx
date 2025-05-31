
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

interface Child {
  weeklyGoal: number;
  weeklyProgress: number;
}

interface WeeklyProgressSectionProps {
  selectedChild: Child;
}

const WeeklyProgressSection = ({ selectedChild }: WeeklyProgressSectionProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Goal: {selectedChild.weeklyGoal} minutes</span>
            <span className="text-white font-semibold">{selectedChild.weeklyProgress} / {selectedChild.weeklyGoal} min</span>
          </div>
          <Progress value={(selectedChild.weeklyProgress / selectedChild.weeklyGoal) * 100} className="h-3" />
          <p className="text-sm text-gray-400">
            {selectedChild.weeklyGoal - selectedChild.weeklyProgress} minutes remaining this week
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressSection;
