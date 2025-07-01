
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Calendar, MessageSquare } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-400">Ready to continue your learning journey?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
                onClick={() => navigate('/adaptive-practice-test')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                Adaptive Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                Experience AI-powered personalized learning that adapts to your level
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
                onClick={() => navigate('/games')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-400" />
                Learning Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                Play educational games to make learning fun and engaging
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
                onClick={() => navigate('/calendar')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                Manage your learning schedule and track progress
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
