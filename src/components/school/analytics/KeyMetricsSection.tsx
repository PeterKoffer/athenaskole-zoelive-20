
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Calendar,
  Clock
} from "lucide-react";

const KeyMetricsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="w-10 h-10 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-white">456</p>
              <p className="text-gray-400">Active Students</p>
              <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
                +2.3% this month
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <TrendingUp className="w-10 h-10 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-white">87%</p>
              <p className="text-gray-400">Average Score</p>
              <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
                +5.2% improvement
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Calendar className="w-10 h-10 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-white">94%</p>
              <p className="text-gray-400">Attendance Rate</p>
              <Badge variant="outline" className="text-blue-400 border-blue-400 mt-1">
                Stable
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Clock className="w-10 h-10 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-white">45min</p>
              <p className="text-gray-400">Daily Learning</p>
              <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
                Above target
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyMetricsSection;
