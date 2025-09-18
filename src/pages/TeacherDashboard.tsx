
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Calendar, Users, Play, AlertTriangle, TrendingUp, 
  BookOpen, Brain, Settings, Clock, Target, Activity, Award, Zap 
} from 'lucide-react';
import TeacherSidebar from '@/components/teacher/TeacherSidebar';
import TeacherCalendar from '@/components/teacher/TeacherCalendar';

const TeacherDashboard = () => {
  const { user, loading } = useAuth();
  const { userRole } = useRoleAccess();
  const navigate = useNavigate();

  console.log('[TeacherDashboard] Rendering:', { user: user?.email, userRole, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-slate-900 flex">
      <TeacherSidebar />

      {/* Main Dashboard Area */}
      <div className="flex-1 overflow-hidden">
        {/* Top Stats Bar */}
        <div className="h-20 bg-slate-850 border-b border-slate-700 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-xl font-semibold text-white">Teacher Control Center</h1>
              <p className="text-sm text-slate-400">Monday, Sept 18 • School Year 2023-2024</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Stats Cards */}
            <div className="flex items-center space-x-4 bg-slate-800 rounded-lg px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div>
                <p className="text-xs text-slate-400">Active Classes</p>
                <p className="text-lg font-semibold text-white">5</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-slate-800 rounded-lg px-4 py-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div>
                <p className="text-xs text-slate-400">Students</p>
                <p className="text-lg font-semibold text-white">127</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-slate-800 rounded-lg px-4 py-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <div>
                <p className="text-xs text-slate-400">Avg Score</p>
                <p className="text-lg font-semibold text-white">87%</p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'T'}
                </span>
              </div>
              <div className="text-sm">
                <p className="text-slate-200 font-medium">{user?.email?.split('@')[0] || 'Teacher'}</p>
                <p className="text-slate-400 text-xs">Mathematics Dept.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="h-[calc(100%-5rem)] bg-slate-900 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Next Classes Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white text-lg">
                    <Play className="w-5 h-5 mr-3 text-green-400" />
                    Next Classes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'Math 6A', time: '8:00 AM', room: 'Room 201', students: 25, minutes: 15 },
                    { name: 'Science 5B', time: '10:00 AM', room: 'Lab 1', students: 26, minutes: 135 },
                    { name: 'English 4A', time: '1:00 PM', room: 'Room 105', students: 26, minutes: 315 }
                  ].map((classItem, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-semibold text-white">{classItem.name.slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{classItem.name}</p>
                          <p className="text-xs text-slate-400">{classItem.time} • {classItem.room} • {classItem.students} students</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-slate-300 border-slate-600">
                          {classItem.minutes < 60 ? `${classItem.minutes}m` : `${Math.floor(classItem.minutes/60)}h ${classItem.minutes%60}m`}
                        </Badge>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <Play className="w-3 h-3 mr-1" />
                          Start
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Alerts Section */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white text-lg">
                    <AlertTriangle className="w-5 h-5 mr-3 text-red-400" />
                    Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-400">Missing Work</p>
                        <p className="text-xs text-slate-300">3 students haven't submitted Math homework</p>
                      </div>
                      <Badge className="bg-red-500 text-white">3</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-400">Low Mastery</p>
                        <p className="text-xs text-slate-300">5 students below 70% in fractions</p>
                      </div>
                      <Badge className="bg-yellow-500 text-white">5</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-400">Moderation Flag</p>
                        <p className="text-xs text-slate-300">AI content flagged for review</p>
                      </div>
                      <Badge className="bg-orange-500 text-white">1</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mini-Insights (moved here) */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-3 text-purple-400" />
                    Mini-Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <Activity className="w-4 h-4 text-green-400" />
                        <span className="text-lg font-bold text-green-400">92%</span>
                      </div>
                      <p className="text-xs text-slate-300">Engagement</p>
                      <p className="text-xs text-slate-400">+5% from last week</p>
                    </div>
                    
                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-lg font-bold text-blue-400">87%</span>
                      </div>
                      <p className="text-xs text-slate-300">Standards Met</p>
                      <p className="text-xs text-slate-400">On track</p>
                    </div>
                    
                    <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-lg font-bold text-yellow-400">15</span>
                      </div>
                      <p className="text-xs text-slate-300">Accommodations</p>
                      <p className="text-xs text-slate-400">Active students</p>
                    </div>
                    
                    <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span className="text-lg font-bold text-purple-400">68%</span>
                      </div>
                      <p className="text-xs text-slate-300">AI Usage</p>
                      <p className="text-xs text-slate-400">This week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-3 space-y-6">
              {/* Quick Actions */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center justify-between">
                    <span className="flex items-center">
                      <Settings className="w-5 h-5 mr-3 text-blue-400" />
                      Quick Actions
                    </span>
                    <Button size="sm" variant="outline" className="text-xs bg-slate-700 border-slate-600 text-slate-300">
                      Customize
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 justify-start h-12"
                      onClick={() => navigate('/teacher-dashboard/assignments')}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Create Assignment
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 justify-start h-12"
                      onClick={() => navigate('/teacher-dashboard/communication')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Message Parents
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 justify-start h-12"
                      onClick={() => navigate('/teacher-dashboard/library')}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Lesson Templates
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 justify-start h-12"
                      onClick={() => navigate('/teacher-dashboard/progress')}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Calendar */}
              <TeacherCalendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;