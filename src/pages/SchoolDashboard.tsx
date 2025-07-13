
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, School, Users, BarChart3, Calendar, Menu, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import SchoolManagementDropdown from '@/components/school/SchoolManagementDropdown';

const SchoolDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showTeachingSettings, setShowTeachingSettings] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading school dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">School Dashboard</h1>
              <p className="text-muted-foreground">Manage school operations and view analytics</p>
            </div>
          </div>
          <SchoolManagementDropdown onShowTeachingSettings={() => setShowTeachingSettings(true)} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Student Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage student records, enrollment, and academic progress.
              </p>
              <Button 
                className="w-full"
                onClick={() => navigate('/student-management')}
              >
                View Students
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <School className="w-5 h-5 mr-2 text-primary" />
                Staff Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Monitor teacher performance and staff assignments.
              </p>
              <Button 
                className="w-full"
                onClick={() => navigate('/staff-management')}
              >
                Manage Staff
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View school performance metrics and reports.
              </p>
              <Button 
                className="w-full"
                onClick={() => navigate('/school-analytics')}
              >
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Schedule Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage class schedules and school calendar.
              </p>
              <Button 
                className="w-full"
                onClick={() => navigate('/schedule-management')}
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {showTeachingSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Teaching Perspective Settings</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowTeachingSettings(false)}
              >
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">School Direction</label>
                <select className="w-full p-2 border rounded">
                  <option value="none">None</option>
                  <option value="mild-christian">Mild Christian</option>
                  <option value="strong-christian">Strong Christian</option>
                  <option value="secular">Secular</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <Button onClick={() => setShowTeachingSettings(false)}>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolDashboard;
