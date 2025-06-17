
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, BarChart3, TrendingUp, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SchoolNavbar from "@/components/school/SchoolNavbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AcademicReportsPage = () => {
  const navigate = useNavigate();

  const gradeData = [
    { subject: 'Mathematics', average: 85, a_grades: 45, b_grades: 35, c_grades: 15, d_grades: 5 },
    { subject: 'English', average: 82, a_grades: 40, b_grades: 40, c_grades: 15, d_grades: 5 },
    { subject: 'Science', average: 87, a_grades: 50, b_grades: 30, c_grades: 15, d_grades: 5 },
    { subject: 'History', average: 79, a_grades: 35, b_grades: 45, c_grades: 15, d_grades: 5 },
  ];

  const progressData = [
    { month: 'Sep', mathematics: 78, english: 75, science: 80 },
    { month: 'Oct', mathematics: 82, english: 78, science: 83 },
    { month: 'Nov', mathematics: 85, english: 82, science: 87 },
    { month: 'Dec', mathematics: 87, english: 85, science: 89 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SchoolNavbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/school-dashboard')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Academic Reports</h1>
              <p className="text-gray-400">Comprehensive academic performance analysis</p>
            </div>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
            <TabsTrigger value="grades" className="data-[state=active]:bg-purple-600">Grade Distribution</TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-purple-600">Progress Trends</TabsTrigger>
            <TabsTrigger value="detailed" className="data-[state=active]:bg-purple-600">Detailed Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-blue-400">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    School Average
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">83.2%</div>
                  <p className="text-gray-400 text-sm">All subjects combined</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-green-400">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    A Grades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">42.5%</div>
                  <p className="text-gray-400 text-sm">Students with A grades</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-purple-400">
                    <FileText className="w-5 h-5 mr-2" />
                    Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">+5.3%</div>
                  <p className="text-gray-400 text-sm">Since last quarter</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-orange-400">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Top Subject
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">Science</div>
                  <p className="text-gray-400 text-sm">87% average</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="grades" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Grade Distribution by Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="subject" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="a_grades" stackId="a" fill="#10B981" name="A Grades" />
                      <Bar dataKey="b_grades" stackId="a" fill="#3B82F6" name="B Grades" />
                      <Bar dataKey="c_grades" stackId="a" fill="#F59E0B" name="C Grades" />
                      <Bar dataKey="d_grades" stackId="a" fill="#EF4444" name="D Grades" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Academic Progress Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="mathematics" stroke="#8B5CF6" strokeWidth={2} name="Mathematics" />
                      <Line type="monotone" dataKey="english" stroke="#10B981" strokeWidth={2} name="English" />
                      <Line type="monotone" dataKey="science" stroke="#F59E0B" strokeWidth={2} name="Science" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <div className="grid gap-6">
              {gradeData.map((subject) => (
                <Card key={subject.subject} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">{subject.subject} Detailed Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{subject.a_grades}%</div>
                        <div className="text-gray-400">A Grades</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{subject.b_grades}%</div>
                        <div className="text-gray-400">B Grades</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{subject.c_grades}%</div>
                        <div className="text-gray-400">C Grades</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{subject.d_grades}%</div>
                        <div className="text-gray-400">D Grades</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                      <div className="text-white font-semibold">Class Average: {subject.average}%</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AcademicReportsPage;
