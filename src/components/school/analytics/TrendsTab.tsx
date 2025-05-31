
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award,
  TrendingUp
} from "lucide-react";
import { 
  topPerformances,
  monthlyImprovements
} from "@/data/schoolAnalytics";

const TrendsTab = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Top Performances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformances.map((performance, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span className="text-white">{performance.category}</span>
                <Badge variant="outline" className={`text-${performance.color}-400 border-${performance.color}-400`}>
                  {performance.value}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Improvements This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyImprovements.map((improvement, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span className="text-white">{improvement.category}</span>
                <Badge variant="outline" className={`text-${improvement.color}-400 border-${improvement.color}-400`}>
                  {improvement.improvement}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsTab;
