
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Database, Shield, Activity } from "lucide-react";

const SystemManagement = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-700 rounded-lg">
            <h4 className="text-white font-medium mb-2">Server Status</h4>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">API Server</span>
              <span className="text-green-400">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Database</span>
              <span className="text-green-400">Connected</span>
            </div>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Database className="w-4 h-4 mr-2" />
            Database Management
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-700 rounded-lg">
            <h4 className="text-white font-medium mb-2">Security Status</h4>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Firewall</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">SSL Certificate</span>
              <span className="text-green-400">Valid</span>
            </div>
          </div>
          <Button className="w-full bg-red-600 hover:bg-red-700">
            <Activity className="w-4 h-4 mr-2" />
            View Security Logs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemManagement;
