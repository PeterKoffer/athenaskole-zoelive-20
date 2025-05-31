
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Student, Class } from "@/types/school";

interface ClassStudentsTabProps {
  currentClass: Class;
  selectedClass: string;
  classes: Class[];
  onUpdateClasses: (classes: Class[]) => void;
}

const ClassStudentsTab = ({ currentClass, selectedClass, classes, onUpdateClasses }: ClassStudentsTabProps) => {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");

  const handleAddStudent = () => {
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;
    
    const newStudent: Student = {
      id: Date.now().toString(),
      name: newStudentName,
      email: newStudentEmail,
      enrollmentDate: new Date().toISOString().split('T')[0],
      progress: 0,
      attendance: 100,
      grades: []
    };

    const updatedClasses = classes.map(cls => 
      cls.id === selectedClass 
        ? { ...cls, students: [...cls.students, newStudent] }
        : cls
    );

    onUpdateClasses(updatedClasses);
    setNewStudentName("");
    setNewStudentEmail("");
    setShowAddStudent(false);
  };

  const handleRemoveStudent = (studentId: string) => {
    const updatedClasses = classes.map(cls => 
      cls.id === selectedClass 
        ? { ...cls, students: cls.students.filter(s => s.id !== studentId) }
        : cls
    );
    onUpdateClasses(updatedClasses);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Elever i {currentClass.name}
          </CardTitle>
          <Button 
            onClick={() => setShowAddStudent(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Tilføj Elev
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddStudent && (
          <div className="mb-6 p-4 bg-gray-700 rounded-lg space-y-4">
            <h3 className="text-white font-semibold">Tilføj ny elev</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Elevens navn"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="bg-gray-600 text-white border-gray-500"
              />
              <Input
                placeholder="Email adresse"
                type="email"
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
                className="bg-gray-600 text-white border-gray-500"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleAddStudent}
                className="bg-green-600 hover:bg-green-700"
              >
                Tilføj
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowAddStudent(false)}
                className="text-gray-300 border-gray-600"
              >
                Annuller
              </Button>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">Navn</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Fremskridt</TableHead>
              <TableHead className="text-gray-300">Fremmøde</TableHead>
              <TableHead className="text-gray-300">Indmeldelse</TableHead>
              <TableHead className="text-gray-300">Handlinger</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentClass.students.map((student) => (
              <TableRow key={student.id} className="border-gray-700">
                <TableCell className="text-white font-medium">{student.name}</TableCell>
                <TableCell className="text-gray-300">{student.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {student.progress}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {student.attendance}%
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">{student.enrollmentDate}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="text-blue-400 border-blue-400 hover:bg-blue-900">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleRemoveStudent(student.id)}
                      className="text-red-400 border-red-400 hover:bg-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ClassStudentsTab;
