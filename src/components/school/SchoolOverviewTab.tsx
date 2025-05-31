
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  UserPlus, 
  MessageSquare 
} from "lucide-react";

const SchoolOverviewTab = () => {
  const recentActivity = [
    { student: "Emma Nielsen", activity: "Completed mathematics lesson", time: "10 min ago", class: "3.A" },
    { student: "Lucas Hansen", activity: "Scored 95% in Danish quiz", time: "25 min ago", class: "2.B" },
    { student: "Sofia Andersen", activity: "Started new English lesson", time: "1 hour ago", class: "4.A" }
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">{activity.student}</p>
                  <p className="text-gray-400 text-sm">{activity.activity}</p>
                  <Badge variant="outline" className="text-xs mt-1">{activity.class}</Badge>
                </div>
                <p className="text-gray-400 text-sm">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start">
            <Users className="w-4 h-4 mr-2" />
            Manage Classes
          </Button>
          <Button className="w-full bg-green-600 hover:bg-green-700 justify-start">
            <UserPlus className="w-4 h-4 mr-2" />
            Register New Student
          </Button>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Detailed Statistics
          </Button>
          <Button className="w-full bg-orange-600 hover:bg-orange-700 justify-start">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Message to Parents
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolOverviewTab;
