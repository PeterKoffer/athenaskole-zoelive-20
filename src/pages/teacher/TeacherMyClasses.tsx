import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Users, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherMyClasses = () => {
  const navigate = useNavigate();

  const classes = [
    {
      id: 1,
      name: "Mathematics 6A",
      subject: "Mathematics",
      grade: "Grade 6",
      students: 24,
      room: "Room 201",
      schedule: "Mon, Wed, Fri 8:00-9:30 AM",
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Science 5B",
      subject: "Science",
      grade: "Grade 5",
      students: 22,
      room: "Lab 1",
      schedule: "Tue, Thu 10:00-11:30 AM",
      color: "bg-green-500"
    },
    {
      id: 3,
      name: "English 4A",
      subject: "English",
      grade: "Grade 4",
      students: 26,
      room: "Room 105",
      schedule: "Mon-Fri 1:00-2:30 PM",
      color: "bg-purple-500"
    },
    {
      id: 4,
      name: "Mathematics 5A",
      subject: "Mathematics",
      grade: "Grade 5",
      students: 23,
      room: "Room 203",
      schedule: "Tue, Thu 2:30-4:00 PM",
      color: "bg-orange-500"
    }
  ];

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
              <BookOpen className="w-6 h-6 mr-3 text-blue-400" />
              My Classes
            </h1>
            <p className="text-sm text-slate-400">Manage your assigned classes and sections</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-5rem)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <Card key={classItem.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-3 h-3 rounded-full ${classItem.color}`}></div>
                    <span className="text-xs text-slate-400">{classItem.grade}</span>
                  </div>
                  <CardTitle className="text-white text-lg">{classItem.name}</CardTitle>
                  <p className="text-sm text-slate-400">{classItem.subject}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-300">
                      <Users className="w-4 h-4 mr-2 text-slate-400" />
                      {classItem.students} students
                    </div>
                    <div className="text-sm text-slate-300">
                      <p className="text-slate-400">Room:</p>
                      <p>{classItem.room}</p>
                    </div>
                    <div className="text-sm text-slate-300">
                      <p className="text-slate-400">Schedule:</p>
                      <p>{classItem.schedule}</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 flex-1">
                        View Details
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                        Start Lesson
                      </Button>
                    </div>
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

export default TeacherMyClasses;