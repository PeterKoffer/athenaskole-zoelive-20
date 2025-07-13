
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Search, UserPlus, GraduationCap, BookOpen } from 'lucide-react';

const StudentManagementPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock student data
  const students = [
    { id: 1, name: "Emma Nielsen", grade: "3rd Grade", class: "3.A", status: "Active", progress: 85 },
    { id: 2, name: "Lucas Hansen", grade: "2nd Grade", class: "2.B", status: "Active", progress: 92 },
    { id: 3, name: "Sofia Andersen", grade: "4th Grade", class: "4.A", status: "Active", progress: 78 },
    { id: 4, name: "Oliver Petersen", grade: "3rd Grade", class: "3.A", status: "Active", progress: 88 },
    { id: 5, name: "Ida Larsen", grade: "2nd Grade", class: "2.B", status: "Inactive", progress: 65 },
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/school-dashboard')}
              className="text-muted-foreground hover:text-foreground mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Student Management</h1>
              <p className="text-muted-foreground">Manage student records, enrollment, and academic progress</p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Student
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search students by name or class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filter by Grade</Button>
              <Button variant="outline">Export List</Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                    {student.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{student.grade} • {student.class}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Academic Progress</span>
                      <span>{student.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Assignments
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or add new students.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentManagementPage;
