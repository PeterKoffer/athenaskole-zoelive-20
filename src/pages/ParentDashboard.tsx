
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, User, TrendingUp, Calendar, MessageSquare, Award, BookOpen, ChevronDown, BarChart3, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const children = [
    {
      id: 1,
      name: "Emma",
      class: "3.A",
      avatar: "👧",
      subjects: {
        mathematics: { progress: 85, recentActivity: "Completed fractions lesson" },
        danish: { progress: 92, recentActivity: "Read H.C. Andersen fairy tale" },
        english: { progress: 78, recentActivity: "Practiced colors and numbers" }
      },
      weeklyGoal: 120,
      weeklyProgress: 95,
      streak: 5
    }
  ];

  const selectedChild = children[0];

  const recentMessages = [
    { from: "Teacher Hansen", subject: "Emma is doing really well", time: "2 hours ago", unread: true },
    { from: "School", subject: "Parent meeting next week", time: "1 day ago", unread: false },
    { from: "Teacher Andersen", subject: "Mathematics progress", time: "3 days ago", unread: false }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-green-500" />
              <div>
                <h1 className="text-xl font-bold">Parent Dashboard</h1>
                <p className="text-sm text-gray-400">Track your child's progress</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={signOut}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            Log out
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Child selector */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{selectedChild.avatar}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedChild.name}</h2>
                <p className="text-gray-400">{selectedChild.class} • Aarhus West School</p>
              </div>
              <div className="ml-auto flex items-center space-x-4">
                <div className="text-center">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="text-white font-semibold">{selectedChild.streak} days</span>
                  </div>
                  <p className="text-gray-400 text-sm">Streak</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Analytics and Parent Tools Dropdown Menus */}
        <div className="flex gap-4 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Progress Analytics
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
              <DropdownMenuItem className="hover:bg-gray-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Weekly Progress
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Subject Performance
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <Award className="w-4 h-4 mr-2" />
                Achievements
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <Calendar className="w-4 h-4 mr-2" />
                Activity Timeline
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                Parent Tools
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
              <DropdownMenuItem className="hover:bg-gray-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Teachers
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meetings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Set Learning Goals
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Weekly progress */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Goal: {selectedChild.weeklyGoal} minutes</span>
                <span className="text-white font-semibold">{selectedChild.weeklyProgress} / {selectedChild.weeklyGoal} min</span>
              </div>
              <Progress value={(selectedChild.weeklyProgress / selectedChild.weeklyGoal) * 100} className="h-3" />
              <p className="text-sm text-gray-400">
                {selectedChild.weeklyGoal - selectedChild.weeklyProgress} minutes remaining this week
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="progress" className="data-[state=active]:bg-gray-700">Progress</TabsTrigger>
            <TabsTrigger value="subjects" className="data-[state=active]:bg-gray-700">Subjects</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-gray-700">Activity</TabsTrigger>
            <TabsTrigger value="communication" className="data-[state=active]:bg-gray-700">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(selectedChild.subjects).map(([subject, data]) => (
                <Card key={subject} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white capitalize flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      {subject}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">Progress</span>
                        <span className="text-white font-semibold">{data.progress}%</span>
                      </div>
                      <Progress value={data.progress} className="h-2" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Recent activity:</p>
                      <p className="text-white text-sm">{data.recentActivity}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Detailed Subject Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Detailed progress for each subject coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Detailed activity history coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Messages from School
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.map((message, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      message.unread ? 'bg-blue-900/20 border-blue-700' : 'bg-gray-700 border-gray-600'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{message.from}</span>
                        <div className="flex items-center space-x-2">
                          {message.unread && <Badge variant="outline" className="text-blue-400 border-blue-400">New</Badge>}
                          <span className="text-gray-400 text-sm">{message.time}</span>
                        </div>
                      </div>
                      <p className="text-gray-300">{message.subject}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  Send Message to School
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParentDashboard;
