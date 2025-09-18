
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, BarChart3, Calendar, Menu, ChevronDown, GraduationCap, Clock, Settings, Brain } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import TeacherSubjectWeighting from '@/components/teacher/TeacherSubjectWeighting';
import ClassLessonDurationSettings from '@/components/teacher/ClassLessonDurationSettings';

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
      {/* Dark Professional Sidebar */}
      <div className="w-20 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/training-ground')}
          className="text-slate-400 hover:text-white hover:bg-slate-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex flex-col space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          
          <div className="w-8 h-0.5 bg-slate-600 rounded-full"></div>
          
          {/* Navigation Icons */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-white hover:bg-slate-700"
            onClick={() => navigate('/teacher-dashboard')}
          >
            <BarChart3 className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-white hover:bg-slate-700"
            onClick={() => navigate('/teacher-dashboard/classes')}
          >
            <BookOpen className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-white hover:bg-slate-700"
            onClick={() => navigate('/teacher-dashboard/progress')}
          >
            <Users className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-white hover:bg-slate-700"
            onClick={() => navigate('/teacher-dashboard/ai-preferences')}
          >
            <Brain className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-white hover:bg-slate-700"
            onClick={() => navigate('/teacher-dashboard/duration')}
          >
            <Clock className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-white hover:bg-slate-700"
            onClick={() => navigate('/calendar')}
          >
            <Calendar className="w-5 h-5" />
          </Button>
        </div>
      </div>

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
          <div className="grid grid-cols-4 gap-6 h-full">
            {/* Calendar Section */}
            <div className="col-span-2 space-y-6">
              <Card className="bg-slate-800 border-slate-700 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-white text-lg">
                    <Calendar className="w-5 h-5 mr-3 text-blue-400" />
                    Weekly Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-6 pb-4">
                    <div className="grid grid-cols-7 gap-1 mb-3">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <div key={day} className="text-center text-xs font-medium text-slate-400 p-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 28 }, (_, i) => {
                        const date = i + 1;
                        const hasClass = [2, 4, 6, 9, 11, 13, 16, 18, 20, 23, 25, 27].includes(date);
                        const isToday = date === 18;
                        return (
                          <div
                            key={i}
                            className={`
                              aspect-square flex items-center justify-center text-xs rounded cursor-pointer transition-all
                              ${isToday ? 'bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/30' : 
                                hasClass ? 'bg-slate-700 text-slate-200 border border-slate-600' : 
                                'text-slate-500 hover:bg-slate-700/50'
                              }
                            `}
                          >
                            {date}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Today's Classes Timeline */}
                  <div className="border-t border-slate-700 px-6 py-4">
                    <h4 className="text-sm font-medium text-slate-200 mb-3">Today's Classes</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-2 bg-blue-500/10 rounded border-l-2 border-blue-500">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-200">Math 6A</p>
                          <p className="text-xs text-slate-400">8:00-9:30 • Room 201</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-green-500/10 rounded border-l-2 border-green-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-200">Science 5B</p>
                          <p className="text-xs text-slate-400">10:00-11:30 • Lab 1</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-purple-500/10 rounded border-l-2 border-purple-500">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-200">English 4A</p>
                          <p className="text-xs text-slate-400">13:00-14:30 • Room 105</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Control Panels */}
            <div className="col-span-2 space-y-6">
              {/* Quick Actions */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center">
                    <BarChart3 className="w-5 h-5 mr-3 text-green-400" />
                    Control Panel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 justify-start h-12"
                      onClick={() => navigate('/')}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      New Lesson
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 justify-start h-12"
                      onClick={() => navigate('/announcements')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Announce
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 justify-start h-12"
                      onClick={() => navigate('/analytics')}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 justify-start h-12"
                      onClick={() => navigate('/communication')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card className="bg-slate-800 border-slate-700 flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">System Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-slate-700/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">Quiz submitted: Math 6A</p>
                        <p className="text-xs text-slate-400">2 hours ago • 24 responses</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-slate-700/50 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">Lab reports reviewed</p>
                        <p className="text-xs text-slate-400">5 hours ago • Science 5B</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-slate-700/50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">Parent meeting scheduled</p>
                        <p className="text-xs text-slate-400">1 day ago • Thompson, J.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-slate-700/50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">Weekly report generated</p>
                        <p className="text-xs text-slate-400">1 day ago • All classes</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;