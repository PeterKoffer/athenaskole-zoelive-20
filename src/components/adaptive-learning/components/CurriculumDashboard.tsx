
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Settings, BarChart3 } from 'lucide-react';

const CurriculumDashboard = () => {
  const [activeTab, setActiveTab] = useState('curriculum');

  const tabs = [
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Curriculum Dashboard</h1>
        
        <div className="flex space-x-1 mb-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        <div className="grid gap-6">
          {activeTab === 'curriculum' && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Curriculum Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Manage curriculum standards, learning objectives, and educational content.
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'students' && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Track student progress, performance analytics, and individual learning paths.
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Learning Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  View comprehensive analytics on learning outcomes and student engagement.
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Configure system preferences, integrations, and administrative settings.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurriculumDashboard;
