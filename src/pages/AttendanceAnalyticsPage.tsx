import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SchoolNavbar from "@/components/school/SchoolNavbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AttendanceAnalyticsPage = () => {
  const navigate = useNavigate();

  const dailyAttendance = [
    { day: 'Mon', rate: 96 },
    { day: 'Tue', rate: 94 },
    { day: 'Wed', rate: 95 },
    { day: 'Thu', rate: 93 },
    { day: 'Fri', rate: 92 },
  ];

  const monthlyTrends = [
    { month: 'Sep', rate: 95 },
    { month: 'Oct', rate: 94 },
    { month: 'Nov', rate: 96 },
    { month: 'Dec', rate: 94 },
  ];

  const classAttendance = [
    { class: '1A', present: 28, absent: 2, rate: 93.3 },
    { class: '1B', present: 29, absent: 1, rate: 96.7 },
    { class: '2A', present: 27, absent: 3, rate: 90.0 },
    { class: '2B', present: 30, absent: 0, rate: 100.0 },
  ];

  const attendanceDistribution = [
    { name: 'Present', value: 94.2, color: '#10B981' },
    { name: 'Absent', value: 5.8, color: '#EF4444' },
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
            <h1 className="text-3xl font-bold">Attendance Analytics</h1>
            <p className="text-gray-400">Monitor and analyze student attendance patterns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-green-400">
                <Users className="w-5 h-5 mr-2" />
                Overall Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">94.2%</div>
              <p className="text-gray-400 text-sm">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-blue-400">
                <Calendar className="w-5 h-5 mr-2" />
                Today's Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">96.1%</div>
              <p className="text-gray-400 text-sm">465/485 students</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-purple-400">
                <TrendingUp className="w-5 h-5 mr-2" />
                Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+1.2%</div>
              <p className="text-gray-400 text-sm">vs last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-red-400">
                <AlertTriangle className="w-5 h-5 mr-2" />
                At Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">8</div>
              <p className="text-gray-400 text-sm">Students &lt; 80%</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="daily" className="data-[state=active]:bg-purple-600">Daily</TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-purple-600">Trends</TabsTrigger>
            <TabsTrigger value="classes" className="data-[state=active]:bg-purple-600">By Class</TabsTrigger>
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Daily Attendance Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyAttendance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" domain={[85, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="rate" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Monthly Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" domain={[90, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="rate" stroke="#8B5CF6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Attendance by Class</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classAttendance.map((classData) => (
                    <div key={classData.class} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-white">Class {classData.class}</h3>
                        <span className="text-green-400 font-semibold">{classData.rate}%</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Present: {classData.present}</span>
                        <span>Absent: {classData.absent}</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-green-400 h-2 rounded-full" 
                          style={{ width: `${classData.rate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Attendance Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={attendanceDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {attendanceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Students Requiring Attention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <div className="font-semibold text-white">Maria Petersen</div>
                      <div className="text-red-400 text-sm">Attendance: 76% (Class 2A)</div>
                    </div>
                    <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <div className="font-semibold text-white">Oliver Thomsen</div>
                      <div className="text-yellow-400 text-sm">Attendance: 83% (Class 1B)</div>
                    </div>
                    <div className="p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                      <div className="font-semibold text-white">Isabella Rasmussen</div>
                      <div className="text-orange-400 text-sm">Attendance: 79% (Class 3A)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AttendanceAnalyticsPage;
