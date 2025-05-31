
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Settings, 
  Building, 
  Shield, 
  AlertTriangle 
} from "lucide-react";

const AdminOverviewTab = () => {
  const recentActivity = [
    { action: "New school registered", details: "Copenhagen Elementary", time: "5 min ago", type: "success" },
    { action: "System maintenance", details: "Database optimization completed", time: "1 hour ago", type: "info" },
    { action: "Security alert", details: "Failed login attempts detected", time: "2 hours ago", type: "warning" }
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Recent System Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-sm">{activity.details}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs mt-1 ${
                      activity.type === 'success' ? 'border-green-500 text-green-400' :
                      activity.type === 'warning' ? 'border-yellow-500 text-yellow-400' :
                      'border-blue-500 text-blue-400'
                    }`}
                  >
                    {activity.type}
                  </Badge>
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
            <Settings className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full bg-red-600 hover:bg-red-700 justify-start">
            <Shield className="w-4 h-4 mr-2" />
            Manage System Security
          </Button>
          <Button className="w-full bg-orange-600 hover:bg-orange-700 justify-start">
            <Building className="w-4 h-4 mr-2" />
            School Administration
          </Button>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start">
            <Settings className="w-4 h-4 mr-2" />
            System Configuration
          </Button>
          <Button className="w-full bg-yellow-600 hover:bg-yellow-700 justify-start">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Security Alerts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverviewTab;
