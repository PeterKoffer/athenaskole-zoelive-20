import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, TrendingUp, Award, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherStudentProgress = () => {
  const navigate = useNavigate();

  const students = [
    {
      id: 1,
      name: "Emma Johnson",
      class: "Math 6A",
      avgScore: 92,
      trend: "up",
      lastActivity: "2 hours ago",
      assignments: { completed: 18, total: 20 }
    },
    {
      id: 2,
      name: "Liam Smith",
      class: "Math 6A",
      avgScore: 78,
      trend: "down",
      lastActivity: "1 day ago",
      assignments: { completed: 15, total: 20 }
    },
    {
      id: 3,
      name: "Olivia Brown",
      class: "Science 5B",
      avgScore: 88,
      trend: "up",
      lastActivity: "3 hours ago",
      assignments: { completed: 17, total: 18 }
    },
    {
      id: 4,
      name: "Noah Davis",
      class: "English 4A",
      avgScore: 85,
      trend: "stable",
      lastActivity: "5 hours ago",
      assignments: { completed: 22, total: 24 }
    },
    {
      id: 5,
      name: "Ava Wilson",
      class: "Math 5A",
      avgScore: 94,
      trend: "up",
      lastActivity: "1 hour ago",
      assignments: { completed: 19, total: 19 }
    },
    {
      id: 6,
      name: "William Garcia",
      class: "Science 5B",
      avgScore: 76,
      trend: "up",
      lastActivity: "4 hours ago",
      assignments: { completed: 14, total: 18 }
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default:
        return <div className="w-4 h-4 border border-slate-400 rounded-full"></div>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="h-[100dvh] bg-slate-900 flex">
      {/* Sidebar placeholder */}
      <div className="w-20 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/teacher-dashboard')}
          className="text-slate-400 hover:text-white hover:bg-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="h-20 bg-slate-850 border-b border-slate-700 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white flex items-center">
              <Users className="w-6 h-6 mr-3 text-green-400" />
              Student Progress
            </h1>
            <p className="text-sm text-slate-400">Monitor individual student performance and engagement</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4 bg-slate-800 rounded-lg px-4 py-2">
              <div className="text-center">
                <p className="text-xs text-slate-400">Class Average</p>
                <p className="text-lg font-semibold text-green-400">85.5%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-5rem)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {students.map((student) => (
              <Card key={student.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-white text-sm">{student.name}</CardTitle>
                        <p className="text-xs text-slate-400">{student.class}</p>
                      </div>
                    </div>
                    {getTrendIcon(student.trend)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-300">Average Score</span>
                      </div>
                      <span className={`text-sm font-semibold ${getScoreColor(student.avgScore)}`}>
                        {student.avgScore}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-300">Last Activity</span>
                      </div>
                      <span className="text-sm text-slate-400">{student.lastActivity}</span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">Assignments</span>
                        <span className="text-slate-400">
                          {student.assignments.completed}/{student.assignments.total}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(student.assignments.completed / student.assignments.total) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherStudentProgress;