
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  ClipboardList, 
  MessageSquare,
  GameController
} from "lucide-react";

const TeacherOverviewTab = () => {
  const recentActivity = [
    { student: "Emma Nielsen", activity: "Completed mathematics assignment", time: "15 min ago", class: "3.A", grade: "A" },
    { student: "Lucas Hansen", activity: "Started new English lesson", time: "30 min ago", class: "2.B", grade: null },
    { student: "Sofia Andersen", activity: "Submitted creative writing", time: "1 hour ago", class: "4.A", grade: "B+" }
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Recent Student Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">{activity.student}</p>
                  <p className="text-gray-400 text-sm">{activity.activity}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{activity.class}</Badge>
                    {activity.grade && (
                      <Badge variant="outline" className="text-xs text-green-400 border-green-500">
                        {activity.grade}
                      </Badge>
                    )}
                  </div>
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
            <BookOpen className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start">
            <BookOpen className="w-4 h-4 mr-2" />
            Create New Lesson
          </Button>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start">
            <Users className="w-4 h-4 mr-2" />
            Manage Classes
          </Button>
          <Button className="w-full bg-green-600 hover:bg-green-700 justify-start">
            <ClipboardList className="w-4 h-4 mr-2" />
            Grade Assignments
          </Button>
          <Button className="w-full bg-orange-600 hover:bg-orange-700 justify-start">
            <GameController className="w-4 h-4 mr-2" />
            Assign Games
          </Button>
          <Button className="w-full bg-teal-600 hover:bg-teal-700 justify-start">
            <MessageSquare className="w-4 h-4 mr-2" />
            Message Parents
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherOverviewTab;
