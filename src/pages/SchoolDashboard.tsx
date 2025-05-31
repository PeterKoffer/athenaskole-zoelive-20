
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, TrendingUp, Calendar, MessageSquare, School, BarChart3, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ClassManagement from "@/components/school/ClassManagement";
import AnalyticsDashboard from "@/components/school/AnalyticsDashboard";
import StudentRegistration from "@/components/school/StudentRegistration";

const SchoolDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const stats = {
    totalStudents: 456,
    totalTeachers: 32,
    averageProgress: 78,
    attendanceRate: 94
  };

  const recentActivity = [
    { student: "Emma Nielsen", activity: "Afsluttede matematik lektion", time: "10 min siden", class: "3.A" },
    { student: "Lucas Hansen", activity: "Scorede 95% i dansk quiz", time: "25 min siden", class: "2.B" },
    { student: "Sofia Andersen", activity: "Startede ny engelsk lektion", time: "1 time siden", class: "4.A" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tilbage
            </Button>
            <div className="flex items-center space-x-3">
              <School className="w-8 h-8 text-orange-500" />
              <div>
                <h1 className="text-xl font-bold">Skole Dashboard</h1>
                <p className="text-sm text-gray-400">Aarhus Vest Skole</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={signOut}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            Log ud
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
                  <p className="text-gray-400">Elever</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Users className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalTeachers}</p>
                  <p className="text-gray-400">Lærere</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <TrendingUp className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.averageProgress}%</p>
                  <p className="text-gray-400">Gennemsnit fremskridt</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Calendar className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.attendanceRate}%</p>
                  <p className="text-gray-400">Fremmøde</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">Overblik</TabsTrigger>
            <TabsTrigger value="classes" className="data-[state=active]:bg-gray-700">Klasser</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-gray-700">Elever</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-700">Statistik</TabsTrigger>
            <TabsTrigger value="registration" className="data-[state=active]:bg-gray-700">Registrering</TabsTrigger>
            <TabsTrigger value="communication" className="data-[state=active]:bg-gray-700">Kommunikation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Seneste aktivitet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{activity.student}</p>
                          <p className="text-gray-400 text-sm">{activity.activity}</p>
                          <Badge variant="outline" className="text-xs mt-1">{activity.class}</Badge>
                        </div>
                        <p className="text-gray-400 text-sm">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Hurtig Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Administrer Klasser
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700 justify-start">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrer Ny Elev
                  </Button>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Se Detaljeret Statistik
                  </Button>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Besked til Forældre
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <ClassManagement />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Elev overblik</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Detaljeret elev statistik og fremskridt kommer snart...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="registration" className="space-y-6">
            <StudentRegistration />
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Kommunikation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Kommunikationsplatform med lærere og elever kommer snart...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SchoolDashboard;
