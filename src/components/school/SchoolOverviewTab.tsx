
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, TrendingUp, Users } from "lucide-react";

const SchoolOverviewTab = () => {
  console.log('[SchoolOverviewTab] Rendering overview tab');

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Users className="w-4 h-4 mr-2" />
            Add Student
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Event
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Message
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <p className="text-white font-medium">New student registered</p>
                <p className="text-gray-400 text-sm">Emma Johnson joined Class 5A</p>
              </div>
              <span className="text-gray-400 text-sm">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <p className="text-white font-medium">Teacher submitted grades</p>
                <p className="text-gray-400 text-sm">Mathematics grades for Class 4B</p>
              </div>
              <span className="text-gray-400 text-sm">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <p className="text-white font-medium">Parent meeting scheduled</p>
                <p className="text-gray-400 text-sm">Discussion about student progress</p>
              </div>
              <span className="text-gray-400 text-sm">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-600/20 rounded-lg">
              <div className="text-2xl font-bold text-green-400">98%</div>
              <div className="text-gray-300">System Uptime</div>
            </div>
            <div className="text-center p-4 bg-blue-600/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">24</div>
              <div className="text-gray-300">Active Sessions</div>
            </div>
            <div className="text-center p-4 bg-purple-600/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">156</div>
              <div className="text-gray-300">Daily Logins</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolOverviewTab;
