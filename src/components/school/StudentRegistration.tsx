
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Upload } from "lucide-react";

const StudentRegistration = () => {
  console.log('[StudentRegistration] Rendering student registration');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Student Registration</h2>
        <Button className="bg-green-600 hover:bg-green-700">
          <Upload className="w-4 h-4 mr-2" />
          Bulk Import
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              New Student Registration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                <Input id="firstName" className="bg-gray-700 border-gray-600 text-white" placeholder="Enter first name" />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                <Input id="lastName" className="bg-gray-700 border-gray-600 text-white" placeholder="Enter last name" />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input id="email" type="email" className="bg-gray-700 border-gray-600 text-white" placeholder="student@example.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grade" className="text-gray-300">Grade</Label>
                <Select>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="1">Grade 1</SelectItem>
                    <SelectItem value="2">Grade 2</SelectItem>
                    <SelectItem value="3">Grade 3</SelectItem>
                    <SelectItem value="4">Grade 4</SelectItem>
                    <SelectItem value="5">Grade 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="class" className="text-gray-300">Class</Label>
                <Select>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="1a">Class 1A</SelectItem>
                    <SelectItem value="2b">Class 2B</SelectItem>
                    <SelectItem value="3c">Class 3C</SelectItem>
                    <SelectItem value="4a">Class 4A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="parentEmail" className="text-gray-300">Parent Email</Label>
              <Input id="parentEmail" type="email" className="bg-gray-700 border-gray-600 text-white" placeholder="parent@example.com" />
            </div>

            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Register Student
            </Button>
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Emma Johnson", grade: "5A", date: "Today" },
                { name: "Michael Brown", grade: "4B", date: "Yesterday" },
                { name: "Sarah Davis", grade: "3C", date: "2 days ago" },
                { name: "James Wilson", grade: "2A", date: "3 days ago" },
              ].map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{student.name}</p>
                    <p className="text-gray-400 text-sm">Grade {student.grade}</p>
                  </div>
                  <span className="text-gray-400 text-sm">{student.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegistration;
