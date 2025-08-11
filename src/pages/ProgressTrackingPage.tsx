import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, Target, Star, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SchoolNavbar from "@/components/school/SchoolNavbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const ProgressTrackingPage = () => {
  const navigate = useNavigate();

  const overallProgress = [
    { month: 'Sep', mathematics: 75, english: 72, science: 78, history: 70 },
    { month: 'Oct', mathematics: 78, english: 75, science: 81, history: 73 },
    { month: 'Nov', mathematics: 82, english: 79, science: 84, history: 76 },
    { month: 'Dec', mathematics: 85, english: 82, science: 87, history: 79 },
  ];

  const skillsProgress = [
    { skill: 'Reading', current: 85, target: 90 },
    { skill: 'Writing', current: 78, target: 85 },
    { skill: 'Mathematics', current: 87, target: 90 },
    { skill: 'Science', current: 89, target: 92 },
    { skill: 'Critical Thinking', current: 76, target: 80 },
    { skill: 'Collaboration', current: 83, target: 85 },
  ];

  const studentProgress = [
    { name: 'Emma Larsen', mathematics: 92, english: 88, science: 95, history: 85, overall: 90 },
    { name: 'Lucas Hansen', mathematics: 85, english: 82, science: 88, history: 80, overall: 84 },
    { name: 'Sofia Andersen', mathematics: 88, english: 90, science: 86, history: 92, overall: 89 },
    { name: 'Noah Nielsen', mathematics: 79, english: 85, science: 82, history: 78, overall: 81 },
  ];

  const radarData = [
    { subject: 'Mathematics', A: 85, B: 90 },
    { subject: 'English', A: 82, B: 85 },
    { subject: 'Science', A: 87, B: 92 },
    { subject: 'History', A: 79, B: 82 },
    { subject: 'Arts', A: 84, B: 88 },
    { subject: 'PE', A: 91, B: 95 },
  ];

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
            <h1 className="text-3xl font-bold">Progress Tracking</h1>
            <p className="text-gray-400">Monitor student learning progress and achievements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-green-400">
                <TrendingUp className="w-5 h-5 mr-2" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">87.5%</div>
              <p className="text-gray-400 text-sm">Average improvement</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-blue-400">
                <Target className="w-5 h-5 mr-2" />
                Goals Met
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">73%</div>
              <p className="text-gray-400 text-sm">Students meeting targets</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-purple-400">
                <Star className="w-5 h-5 mr-2" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">156</div>
              <p className="text-gray-400 text-sm">Students &gt; 85%</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-orange-400">
                <BarChart3 className="w-5 h-5 mr-2" />
                Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+12.3%</div>
              <p className="text-gray-400 text-sm">Since start of year</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
            <TabsTrigger value="subjects" className="data-[state=active]:bg-purple-600">By Subject</TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-purple-600">Skills</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-purple-600">Individual</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Overall Academic Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={overallProgress}>
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
                      <Line type="monotone" dataKey="history" stroke="#EF4444" strokeWidth={2} name="History" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Subject Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                      <Radar name="Current" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                      <Radar name="Target" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Skills Development Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillsProgress.map((skill) => (
                    <div key={skill.skill} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-white">{skill.skill}</h3>
                        <span className="text-blue-400">{skill.current}% / {skill.target}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-3">
                        <div className="relative">
                          <div 
                            className="bg-blue-400 h-3 rounded-full" 
                            style={{ width: `${(skill.current / skill.target) * 100}%` }}
                          ></div>
                          <div 
                            className="absolute top-0 w-1 h-3 bg-green-400"
                            style={{ left: `${(skill.target / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Current: {skill.current}%</span>
                        <span>Target: {skill.target}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Individual Student Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentProgress.map((student) => (
                    <div key={student.name} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-white">{student.name}</h3>
                        <span className="text-green-400 font-semibold">Overall: {student.overall}%</span>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-sm">
                        <div className="text-center">
                          <div className="text-purple-400 font-medium">{student.mathematics}%</div>
                          <div className="text-gray-400">Math</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 font-medium">{student.english}%</div>
                          <div className="text-gray-400">English</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-medium">{student.science}%</div>
                          <div className="text-gray-400">Science</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-400 font-medium">{student.history}%</div>
                          <div className="text-gray-400">History</div>
                        </div>
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
  );
};

export default ProgressTrackingPage;
