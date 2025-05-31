
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

const WeeklyGoalsCard = () => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Target className="w-5 h-5 text-lime-400" />
          <span>Weekly Goals</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white">
              <span>Learning (180 min/week)</span>
              <span>145/180 min</span>
            </div>
            <Progress value={80} className="h-2 bg-gray-700" />
            <p className="text-xs text-gray-400">35 minutes remaining</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white">
              <span>Games completed (5/week)</span>
              <span>3/5 games</span>
            </div>
            <Progress value={60} className="h-2 bg-gray-700" />
            <p className="text-xs text-gray-400">2 games remaining</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white">
              <span>Perfect scores (3/week)</span>
              <span>1/3 scores</span>
            </div>
            <Progress value={33} className="h-2 bg-gray-700" />
            <p className="text-xs text-gray-400">2 perfect scores remaining</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyGoalsCard;
