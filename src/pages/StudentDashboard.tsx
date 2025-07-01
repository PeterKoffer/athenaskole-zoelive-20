import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Clock, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserMetadata } from "@/types/auth"; // Import UserMetadata
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import PracticeSkillsModal from "@/components/student/PracticeSkillsModal";

const StudentDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [studentName, setStudentName] = useState('Student');

  // Fetch student's name from profile
  useEffect(() => {
    const fetchStudentName = async () => {
      if (!user?.id) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', user.id)
          .single();

        const metadata = user?.user_metadata as UserMetadata | undefined;
        if (profile?.name) {
          const firstName = profile.name.split(' ')[0];
          setStudentName(firstName);
        } else if (metadata?.first_name) {
          setStudentName(metadata.first_name);
        } else if (metadata?.name) {
          const firstName = metadata.name.split(' ')[0];
          setStudentName(firstName);
        }
      } catch (error) {
        console.log('Could not fetch student name from profile, using fallback', error);
        const metadata = user?.user_metadata as UserMetadata | undefined;
        if (metadata?.first_name) {
          setStudentName(metadata.first_name);
        } else if (metadata?.name) {
          const firstName = metadata.name.split(' ')[0];
          setStudentName(firstName);
        }
      }
    };

    fetchStudentName();
  }, [user]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'daily-program':
        navigate('/daily-program');
        break;
      case 'assignments':
        // For now, navigate to daily program as assignments aren't implemented yet
        navigate('/daily-program');
        break;
      case 'practice':
        setShowPracticeModal(true);
        break;
      case 'help':
        // This could show the floating AI tutor or navigate to a help section
        // For now, let's navigate to the daily program where Nelie is available
        navigate('/daily-program');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-lg font-semibold">Loading Student Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-xl">👩‍🏫</span>
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              NELIE
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {studentName}!</h1>
          <p className="text-blue-100">Ready to continue your learning journey?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-blue-400">
                <BookOpen className="w-5 h-5 mr-2" />
                Active Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12</div>
              <p className="text-gray-400 text-sm">In progress</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-green-400">
                <Trophy className="w-5 h-5 mr-2" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">8</div>
              <p className="text-gray-400 text-sm">Badges earned</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-purple-400">
                <Clock className="w-5 h-5 mr-2" />
                Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">4.5h</div>
              <p className="text-gray-400 text-sm">This week</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-yellow-400">
                <Star className="w-5 h-5 mr-2" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">87%</div>
              <p className="text-gray-400 text-sm">Great progress!</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <h4 className="font-semibold text-white">Mathematics Quiz</h4>
                  <p className="text-gray-400 text-sm">Completed 2 hours ago</p>
                </div>
                <div className="text-green-400 font-semibold">92%</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <h4 className="font-semibold text-white">English Reading</h4>
                  <p className="text-gray-400 text-sm">Completed yesterday</p>
                </div>
                <div className="text-blue-400 font-semibold">85%</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <h4 className="font-semibold text-white">Science Lab</h4>
                  <p className="text-gray-400 text-sm">Completed 2 days ago</p>
                </div>
                <div className="text-purple-400 font-semibold">90%</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleQuickAction('daily-program')}
              >
                Start Daily Program
              </Button>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => handleQuickAction('assignments')}
              >
                View Assignments
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => handleQuickAction('practice')}
              >
                Practice Skills
              </Button>
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => handleQuickAction('help')}
              >
                Ask Nelie for Help
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <PracticeSkillsModal 
        isOpen={showPracticeModal} 
        onClose={() => setShowPracticeModal(false)} 
      />
    </div>
  );
};

export default StudentDashboard;
