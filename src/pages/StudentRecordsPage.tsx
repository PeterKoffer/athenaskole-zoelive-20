
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, FileText, User, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SchoolNavbar from "@/components/school/SchoolNavbar";

const StudentRecordsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const mockStudents = [
    { id: 1, name: "Emma Larsen", class: "3A", grade: "A", attendance: "96%" },
    { id: 2, name: "Lucas Hansen", class: "3A", grade: "B+", attendance: "94%" },
    { id: 3, name: "Sofia Andersen", class: "3B", grade: "A-", attendance: "98%" },
    { id: 4, name: "Noah Nielsen", class: "3B", grade: "B", attendance: "92%" },
  ];

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SchoolNavbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/school-dashboard')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Student Records</h1>
            <p className="text-gray-400">Comprehensive student information and academic records</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Search Student Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search students by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
              <TabsTrigger value="academic" className="data-[state=active]:bg-purple-600">Academic Records</TabsTrigger>
              <TabsTrigger value="attendance" className="data-[state=active]:bg-purple-600">Attendance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">{student.name}</h3>
                            <p className="text-gray-400">Class {student.class}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-semibold">Grade: {student.grade}</div>
                          <div className="text-blue-400">Attendance: {student.attendance}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="academic" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Academic Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">{student.name}</h4>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Mathematics:</span>
                            <span className="text-green-400 ml-2">A</span>
                          </div>
                          <div>
                            <span className="text-gray-400">English:</span>
                            <span className="text-blue-400 ml-2">B+</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Science:</span>
                            <span className="text-purple-400 ml-2">A-</span>
                          </div>
                          <div>
                            <span className="text-gray-400">History:</span>
                            <span className="text-yellow-400 ml-2">B</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Attendance Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-white">{student.name}</h4>
                          <span className="text-green-400 font-semibold">{student.attendance}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-400">
                          Days present: 156 / 162 total days
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentRecordsPage;
