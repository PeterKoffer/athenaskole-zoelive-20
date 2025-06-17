
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Megaphone, Plus, Calendar, Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SchoolNavbar from "@/components/school/SchoolNavbar";

const AnnouncementsPage = () => {
  const navigate = useNavigate();
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    priority: "normal" as "low" | "normal" | "high",
    audience: "all" as "all" | "teachers" | "parents" | "students"
  });

  const announcements = [
    {
      id: 1,
      title: "Parent-Teacher Conference Week",
      content: "Parent-teacher conferences will be held from March 15-19. Please schedule your appointments through the parent portal.",
      priority: "high" as const,
      audience: "parents" as const,
      date: "2024-03-10",
      author: "School Administration"
    },
    {
      id: 2,
      title: "Science Fair Preparation",
      content: "All classes will participate in the annual science fair on April 5th. Projects should be submitted by March 30th.",
      priority: "normal" as const,
      audience: "all" as const,
      date: "2024-03-08",
      author: "Maria Andersen"
    },
    {
      id: 3,
      title: "New Lunch Menu Available",
      content: "We're excited to introduce our new healthy lunch options starting next week. Check the cafeteria for details.",
      priority: "low" as const,
      audience: "all" as const,
      date: "2024-03-05",
      author: "Cafeteria Staff"
    },
    {
      id: 4,
      title: "Staff Development Day",
      content: "School will be closed on March 20th for staff professional development. No classes will be held.",
      priority: "high" as const,
      audience: "all" as const,
      date: "2024-03-03",
      author: "School Administration"
    }
  ];

  const handleCreateAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      // In a real app, this would save to the backend
      alert("Announcement created successfully!");
      setNewAnnouncement({
        title: "",
        content: "",
        priority: "normal",
        audience: "all"
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-900/20 border-red-500/30";
      case "normal": return "text-blue-400 bg-blue-900/20 border-blue-500/30";
      case "low": return "text-green-400 bg-green-900/20 border-green-500/30";
      default: return "text-gray-400 bg-gray-900/20 border-gray-500/30";
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case "teachers": return "👨‍🏫";
      case "parents": return "👨‍👩‍👧‍👦";
      case "students": return "👨‍🎓";
      default: return "📢";
    }
  };

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
            <h1 className="text-3xl font-bold">School Announcements</h1>
            <p className="text-gray-400">Manage and broadcast important information</p>
          </div>
        </div>

        <Tabs defaultValue="view" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="view" className="data-[state=active]:bg-purple-600">View Announcements</TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-purple-600">Create New</TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-purple-600">Scheduled</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-blue-400">
                    <Megaphone className="w-5 h-5 mr-2" />
                    Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{announcements.length}</div>
                  <p className="text-gray-400 text-sm">Active announcements</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-red-400">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    High Priority
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {announcements.filter(a => a.priority === "high").length}
                  </div>
                  <p className="text-gray-400 text-sm">Urgent announcements</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-green-400">
                    <Users className="w-5 h-5 mr-2" />
                    Reach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">1,247</div>
                  <p className="text-gray-400 text-sm">People notified</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className={`border ${getPriorityColor(announcement.priority)}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getAudienceIcon(announcement.audience)}</span>
                        <div>
                          <CardTitle className="text-white">{announcement.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                            <span>{announcement.author}</span>
                            <span>•</span>
                            <span>{announcement.date}</span>
                            <span>•</span>
                            <span className="capitalize">{announcement.audience}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{announcement.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Announcement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <Input 
                    placeholder="Enter announcement title..."
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                    <select 
                      value={newAnnouncement.priority}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="normal">Normal Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Audience</label>
                    <select 
                      value={newAnnouncement.audience}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, audience: e.target.value as any }))}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="all">Everyone</option>
                      <option value="teachers">Teachers Only</option>
                      <option value="parents">Parents Only</option>
                      <option value="students">Students Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                  <Textarea 
                    placeholder="Enter announcement content..."
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                  />
                </div>

                <Button 
                  onClick={handleCreateAnnouncement}
                  disabled={!newAnnouncement.title || !newAnnouncement.content}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  <Megaphone className="w-4 h-4 mr-2" />
                  Publish Announcement
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Scheduled Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Scheduled Announcements</h3>
                  <p className="text-gray-400">Create scheduled announcements to be automatically published at specific dates.</p>
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                    Schedule Announcement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
