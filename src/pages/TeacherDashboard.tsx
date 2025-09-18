
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/training-ground')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-green-400" />
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Teacher Dashboard</h1>
                <p className="text-muted-foreground">Manage your classes and student progress</p>
              </div>
            </div>
          </div>

          {/* Quick Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-foreground border-border">
                <Menu className="w-4 h-4 mr-2" />
                Quick Actions
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/teacher-dashboard/classes')}>
                <BookOpen className="w-4 h-4 mr-2" />
                My Classes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/teacher-dashboard/progress')}>
                <Users className="w-4 h-4 mr-2" />
                Student Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/teacher-dashboard/ai-preferences')}>
                <Brain className="w-4 h-4 mr-2" />
                AI Content Preferences
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/teacher-dashboard/duration')}>
                <Clock className="w-4 h-4 mr-2" />
                Lesson Duration
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/')}>
                <Calendar className="w-4 h-4 mr-2" />
                Create Lesson Plan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/analytics')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Dashboard Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <BarChart3 className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Lesson Plan
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/announcements')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/attendance-analytics')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/communication')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Message Parents
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Math Quiz submitted by Grade 6A</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Science lab reports reviewed</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Parent meeting scheduled</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Weekly report generated</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Calendar and Schedule Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Widget */}
          <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Calendar className="w-5 h-5 mr-2" />
                Weekly Schedule Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const date = i + 1;
                  const hasEvent = [5, 8, 12, 15, 19, 22, 26].includes(date);
                  const isToday = date === 18;
                  return (
                    <div
                      key={i}
                      className={`
                        aspect-square flex items-center justify-center text-sm rounded-md cursor-pointer transition-colors
                        ${isToday ? 'bg-primary text-primary-foreground font-bold' : 
                          hasEvent ? 'bg-blue-500/20 text-blue-400 font-medium' : 
                          'text-muted-foreground hover:bg-muted'
                        }
                      `}
                    >
                      {date <= 31 ? date : ''}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-primary rounded mr-2"></div>
                  <span className="text-muted-foreground">Today</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-blue-500/20 border border-blue-500 rounded mr-2"></div>
                  <span className="text-muted-foreground">Classes & Events</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg border-l-4 border-blue-500">
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Math - Grade 6A</p>
                    <p className="text-xs text-muted-foreground">8:00 - 9:30 AM</p>
                    <p className="text-xs text-blue-400">Room 201</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg border-l-4 border-green-500">
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Science - Grade 5</p>
                    <p className="text-xs text-muted-foreground">10:00 - 11:30 AM</p>
                    <p className="text-xs text-green-400">Lab 1</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-500/10 rounded-lg border-l-4 border-purple-500">
                  <div className="text-sm">
                    <p className="font-medium text-foreground">English - Grade 4</p>
                    <p className="text-xs text-muted-foreground">1:00 - 2:30 PM</p>
                    <p className="text-xs text-purple-400">Room 105</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-500/10 rounded-lg border-l-4 border-orange-500">
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Faculty Meeting</p>
                    <p className="text-xs text-muted-foreground">3:00 - 4:00 PM</p>
                    <p className="text-xs text-orange-400">Conference Room</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/calendar')}
              >
                View Full Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;