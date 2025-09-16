
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Calendar, Settings } from 'lucide-react';

const ParentDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('ParentDashboard render:', { user: user?.email, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Parent Dashboard
            </h1>
            <p className="text-gray-400">Monitor your child's learning progress</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                Track your child's learning progress across all subjects
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-400" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                View recent learning activities and achievements
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-400" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                Manage parental controls and learning preferences
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Welcome to the Parent Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                This dashboard will help you stay connected with your child's learning journey. 
                Features will be available soon to track progress, view achievements, and manage settings.
              </p>
              <div className="flex space-x-4">
                <Button 
                  onClick={() => navigate('/home')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Go to Home
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="text-white border-gray-600 hover:bg-gray-700"
                >
                  View Learning Content
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
