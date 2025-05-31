
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Calendar, Plus } from "lucide-react";

const ClassroomManagement = () => {
  const classes = [
    { name: "Mathematics 3.A", students: 24, nextLesson: "Today 09:00", subject: "Math" },
    { name: "English 2.B", students: 22, nextLesson: "Today 11:00", subject: "English" },
    { name: "Science 4.A", students: 26, nextLesson: "Tomorrow 10:00", subject: "Science" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">My Classes</h2>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Class
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {classes.map((classItem, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="text-lg">{classItem.name}</span>
                <Badge variant="outline" className="text-xs">
                  {classItem.subject}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-gray-400">{classItem.students} students</span>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-gray-400">{classItem.nextLesson}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Lessons
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Users className="w-4 h-4 mr-1" />
                  Students
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClassroomManagement;
