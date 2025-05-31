
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus, 
  BookOpen, 
  Calendar,
  TrendingUp,
  ClipboardList
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentDate: string;
  progress: number;
  attendance: number;
  grades: { subject: string; grade: number }[];
}

interface Class {
  id: string;
  name: string;
  grade: string;
  teacher: string;
  subject: string;
  students: Student[];
  schedule: string;
  room: string;
  capacity: number;
}

const ClassManagement = () => {
  const [selectedClass, setSelectedClass] = useState<string>("1a");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");

  const [classes, setClasses] = useState<Class[]>([
    {
      id: "1a",
      name: "1.A",
      grade: "1. klasse",
      teacher: "Lærer Hansen",
      subject: "Matematik & Dansk",
      room: "Lokale 101",
      capacity: 25,
      schedule: "Man-Fre 08:00-14:00",
      students: [
        {
          id: "1",
          name: "Emma Nielsen",
          email: "emma@example.com",
          enrollmentDate: "2024-08-15",
          progress: 85,
          attendance: 96,
          grades: [
            { subject: "Matematik", grade: 8 },
            { subject: "Dansk", grade: 9 },
            { subject: "Engelsk", grade: 7 }
          ]
        },
        {
          id: "2",
          name: "Lucas Hansen",
          email: "lucas@example.com",
          enrollmentDate: "2024-08-15",
          progress: 78,
          attendance: 94,
          grades: [
            { subject: "Matematik", grade: 7 },
            { subject: "Dansk", grade: 8 },
            { subject: "Engelsk", grade: 8 }
          ]
        }
      ]
    },
    {
      id: "1b",
      name: "1.B",
      grade: "1. klasse",
      teacher: "Lærer Andersen",
      subject: "Matematik & Dansk",
      room: "Lokale 102",
      capacity: 25,
      schedule: "Man-Fre 08:00-14:00",
      students: [
        {
          id: "3",
          name: "Sofia Larsen",
          email: "sofia@example.com",
          enrollmentDate: "2024-08-15",
          progress: 92,
          attendance: 98,
          grades: [
            { subject: "Matematik", grade: 10 },
            { subject: "Dansk", grade: 9 },
            { subject: "Engelsk", grade: 9 }
          ]
        }
      ]
    }
  ]);

  const currentClass = classes.find(c => c.id === selectedClass);

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

    setClasses(prev => prev.map(cls => 
      cls.id === selectedClass 
        ? { ...cls, students: [...cls.students, newStudent] }
        : cls
    ));

    setNewStudentName("");
    setNewStudentEmail("");
    setShowAddStudent(false);
  };

  const handleRemoveStudent = (studentId: string) => {
    setClasses(prev => prev.map(cls => 
      cls.id === selectedClass 
        ? { ...cls, students: cls.students.filter(s => s.id !== studentId) }
        : cls
    ));
  };

  return (
    <div className="space-y-6">
      {/* Class Selection */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Klasse Administration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-3">
            {classes.map((cls) => (
              <Button
                key={cls.id}
                variant={selectedClass === cls.id ? "default" : "outline"}
                onClick={() => setSelectedClass(cls.id)}
                className={`p-4 h-auto flex flex-col items-start ${
                  selectedClass === cls.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 border-gray-600 hover:bg-gray-600'
                }`}
              >
                <span className="font-semibold">{cls.name}</span>
                <span className="text-sm opacity-75">{cls.students.length}/{cls.capacity} elever</span>
                <span className="text-xs opacity-60">{cls.teacher}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentClass && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">Overblik</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-gray-700">Elever</TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-gray-700">Skema</TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-gray-700">Opgaver</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{currentClass.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Lærer:</span>
                    <span className="text-white">{currentClass.teacher}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Lokale:</span>
                    <span className="text-white">{currentClass.room}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Kapacitet:</span>
                    <span className="text-white">{currentClass.students.length}/{currentClass.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Fag:</span>
                    <span className="text-white">{currentClass.subject}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Præstation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Gennemsnit fremskridt:</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {Math.round(currentClass.students.reduce((acc, s) => acc + s.progress, 0) / currentClass.students.length)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Gennemsnit fremmøde:</span>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {Math.round(currentClass.students.reduce((acc, s) => acc + s.attendance, 0) / currentClass.students.length)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Aktive elever:</span>
                    <span className="text-white">{currentClass.students.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Skema Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Skema</p>
                    <p className="text-white">{currentClass.schedule}</p>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Se Fuldt Skema
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Ugeskema for {currentClass.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Detaljeret skema functionality kommer snart...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ClipboardList className="w-5 h-5 mr-2" />
                  Opgaver og Bedømmelser
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Opgave administration kommer snart...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ClassManagement;
