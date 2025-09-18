import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, TrendingUp, Award, Clock, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TeacherSidebar from '@/components/teacher/TeacherSidebar';

const TeacherStudentProgress = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');

  const classesList = ['All Classes', 'Math 6A', 'Science 5B', 'English 4A', 'Math 5A'];

  const studentsByClass = {
    'Math 6A': [
      {
        id: 1,
        name: "Emma Johnson",
        avgScore: 92,
        trend: "up",
        lastActivity: "2 hours ago",
        assignments: { completed: 18, total: 20 }
      },
      {
        id: 2,
        name: "Liam Smith",
        avgScore: 78,
        trend: "down",
        lastActivity: "1 day ago",
        assignments: { completed: 15, total: 20 }
      },
      {
        id: 7,
        name: "Sophie Chen",
        avgScore: 89,
        trend: "up",
        lastActivity: "4 hours ago",
        assignments: { completed: 19, total: 20 }
      }
    ],
    'Science 5B': [
      {
        id: 3,
        name: "Olivia Brown",
        avgScore: 88,
        trend: "up",
        lastActivity: "3 hours ago",
        assignments: { completed: 17, total: 18 }
      },
      {
        id: 6,
        name: "William Garcia",
        avgScore: 76,
        trend: "up",
        lastActivity: "4 hours ago",
        assignments: { completed: 14, total: 18 }
      },
      {
        id: 8,
        name: "Isabella Martinez",
        avgScore: 85,
        trend: "stable",
        lastActivity: "2 hours ago",
        assignments: { completed: 16, total: 18 }
      }
    ],
    'English 4A': [
      {
        id: 4,
        name: "Noah Davis",
        avgScore: 85,
        trend: "stable",
        lastActivity: "5 hours ago",
        assignments: { completed: 22, total: 24 }
      },
      {
        id: 9,
        name: "James Wilson",
        avgScore: 79,
        trend: "up",
        lastActivity: "1 day ago",
        assignments: { completed: 20, total: 24 }
      }
    ],
    'Math 5A': [
      {
        id: 5,
        name: "Ava Wilson",
        avgScore: 94,
        trend: "up",
        lastActivity: "1 hour ago",
        assignments: { completed: 19, total: 19 }
      },
      {
        id: 10,
        name: "Lucas Thompson",
        avgScore: 82,
        trend: "stable",
        lastActivity: "6 hours ago",
        assignments: { completed: 17, total: 19 }
      }
    ]
  };

  // Get all students or filtered by class
  const getAllStudents = () => {
    if (selectedClass === 'All Classes') {
      return Object.entries(studentsByClass).flatMap(([className, students]) => 
        students.map(student => ({ ...student, class: className }))
      );
    }
    return (studentsByClass[selectedClass as keyof typeof studentsByClass] || [])
      .map(student => ({ ...student, class: selectedClass }));
  };

  // Filter students by search term
  const filteredStudents = getAllStudents().filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <TeacherSidebar showBackButton={false} />

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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400"
              />
            </div>
            
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-slate-200 rounded-md px-3 py-2 text-sm"
            >
              {classesList.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
            
            <div className="flex items-center space-x-4 bg-slate-800 rounded-lg px-4 py-2">
              <div className="text-center">
                <p className="text-xs text-slate-400">Total Students</p>
                <p className="text-lg font-semibold text-green-400">{filteredStudents.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 bg-slate-800 rounded-lg px-4 py-2">
              <div className="text-center">
                <p className="text-xs text-slate-400">Class Average</p>
                <p className="text-lg font-semibold text-blue-400">
                  {filteredStudents.length > 0 
                    ? Math.round(filteredStudents.reduce((sum, s) => sum + s.avgScore, 0) / filteredStudents.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-5rem)] overflow-y-auto">
          {selectedClass === 'All Classes' ? (
            // Group by class view
            <div className="space-y-8">
              {Object.entries(studentsByClass).map(([className, students]) => {
                const classStudents = students.filter(student =>
                  student.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                
                if (classStudents.length === 0) return null;
                
                return (
                  <div key={className}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{className}</h3>
                      <span className="text-sm text-slate-400">{classStudents.length} students</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {classStudents.map((student) => (
                        <StudentCard key={student.id} student={{ ...student, class: className }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Single class view
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No students found</h3>
              <p className="text-slate-400">
                {searchTerm 
                  ? `No students match "${searchTerm}"` 
                  : "No students in the selected class"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Student Card Component
const StudentCard = ({ student }: { student: any }) => {
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
    <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {student.name.split(' ').map((n: string) => n[0]).join('')}
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
  );
};

export default TeacherStudentProgress;