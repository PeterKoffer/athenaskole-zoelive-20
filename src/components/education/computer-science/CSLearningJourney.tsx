
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

const CSLearningJourney = () => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Award className="w-6 h-6 text-yellow-400" />
          <span>CS Learning Journey</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-purple-900 text-purple-400 border-purple-400">
                Algorithms
              </Badge>
              <span className="text-sm text-white">Basic Problem Solving</span>
            </div>
            <Badge className="bg-green-500">Completed</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-900 text-blue-400 border-blue-400">
                Logic
              </Badge>
              <span className="text-sm text-white">Conditional Statements</span>
            </div>
            <Badge className="bg-amber-500">In Progress</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-lime-900 text-lime-400 border-lime-400">
                Loops
              </Badge>
              <span className="text-sm text-white">Repetition Structures</span>
            </div>
            <Badge className="bg-gray-500">Locked</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-red-900 text-red-400 border-red-400">
                AI
              </Badge>
              <span className="text-sm text-white">Machine Learning Basics</span>
            </div>
            <Badge className="bg-gray-500">Locked</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSLearningJourney;
