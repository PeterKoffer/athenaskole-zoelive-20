
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, BookOpen, Calendar } from "lucide-react";

const ClassManagement = () => {
  console.log('[ClassManagement] Rendering class management');

  const classes = [
    { id: 1, name: "Class 1A", students: 24, teacher: "Ms. Anderson", subject: "General" },
    { id: 2, name: "Class 2B", students: 22, teacher: "Mr. Johnson", subject: "Mathematics" },
    { id: 3, name: "Class 3C", students: 26, teacher: "Mrs. Williams", subject: "English" },
    { id: 4, name: "Class 4A", students: 25, teacher: "Mr. Brown", subject: "Science" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Class Management</h2>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                {classItem.name}
                <BookOpen className="w-5 h-5 text-purple-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Students:</span>
                <div className="flex items-center text-white">
                  <Users className="w-4 h-4 mr-1" />
                  {classItem.students}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Teacher:</span>
                <span className="text-white">{classItem.teacher}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Subject:</span>
                <span className="text-white">{classItem.subject}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1">
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClassManagement;
