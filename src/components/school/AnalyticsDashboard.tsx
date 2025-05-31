
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calendar,
  Target,
  Award,
  Clock
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const AnalyticsDashboard = () => {
  const monthlyData = [
    { month: 'Jan', students: 420, attendance: 94, performance: 78 },
    { month: 'Feb', students: 435, attendance: 96, performance: 82 },
    { month: 'Mar', students: 445, attendance: 93, performance: 85 },
    { month: 'Apr', students: 456, attendance: 95, performance: 88 },
    { month: 'Maj', students: 456, attendance: 94, performance: 87 }
  ];

  const subjectPerformance = [
    { subject: 'Matematik', score: 85, students: 456 },
    { subject: 'Dansk', score: 92, students: 456 },
    { subject: 'Engelsk', score: 78, students: 456 },
    { subject: 'Naturteknik', score: 81, students: 456 },
    { subject: 'Historie', score: 88, students: 456 }
  ];

  const classDistribution = [
    { name: '1. klasse', value: 120, color: '#8884d8' },
    { name: '2. klasse', value: 118, color: '#82ca9d' },
    { name: '3. klasse', value: 108, color: '#ffc658' },
    { name: '4. klasse', value: 110, color: '#ff7300' }
  ];

  const weeklyActivity = [
    { day: 'Man', sessions: 89, avgTime: 45 },
    { day: 'Tir', sessions: 92, avgTime: 48 },
    { day: 'Ons', sessions: 88, avgTime: 42 },
    { day: 'Tor', sessions: 95, avgTime: 50 },
    { day: 'Fre', sessions: 78, avgTime: 38 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="w-10 h-10 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-white">456</p>
                <p className="text-gray-400">Aktive Elever</p>
                <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
                  +2.3% denne måned
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="w-10 h-10 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-white">87%</p>
                <p className="text-gray-400">Gennemsnit Score</p>
                <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
                  +5.2% forbedring
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Calendar className="w-10 h-10 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-white">94%</p>
                <p className="text-gray-400">Fremmøde Rate</p>
                <Badge variant="outline" className="text-blue-400 border-blue-400 mt-1">
                  Stabil
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Clock className="w-10 h-10 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-white">45min</p>
                <p className="text-gray-400">Daglig Læring</p>
                <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
                  Over mål
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="performance" className="data-[state=active]:bg-gray-700">Præstation</TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-gray-700">Engagement</TabsTrigger>
          <TabsTrigger value="subjects" className="data-[state=active]:bg-gray-700">Fag Analyse</TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-gray-700">Tendenser</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Månedlig Præstation Udvikling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Line type="monotone" dataKey="performance" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="attendance" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Klasse Fordeling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={classDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {classDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Ugentlig Aktivitet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="sessions" fill="#8B5CF6" />
                  <Bar dataKey="avgTime" fill="#06B6D4" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Fag Præstation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectPerformance.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <BookOpen className="w-6 h-6 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">{subject.subject}</p>
                        <p className="text-gray-400 text-sm">{subject.students} elever</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${subject.score}%` }}
                        ></div>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        {subject.score}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Top Præstationer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-white">Bedste klasse</span>
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">3.A - 95%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-white">Bedste fag</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">Dansk - 92%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-white">Højeste fremmøde</span>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">1.B - 98%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Forbedringer Denne Måned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-white">Matematik scores</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">+12%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-white">Elev engagement</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">+8%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-white">Opgave aflevering</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">+15%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
