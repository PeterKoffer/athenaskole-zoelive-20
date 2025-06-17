
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MessageSquare, Send, Users, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SchoolNavbar from "@/components/school/SchoolNavbar";

const TeacherCommunicationsPage = () => {
  const navigate = useNavigate();
  const [messageContent, setMessageContent] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  const teachers = [
    { id: '1', name: 'Anne Nielsen', subject: 'Mathematics', class: '3A', email: 'anne.nielsen@school.dk' },
    { id: '2', name: 'Lars Pedersen', subject: 'English', class: '3B', email: 'lars.pedersen@school.dk' },
    { id: '3', name: 'Maria Andersen', subject: 'Science', class: '2A', email: 'maria.andersen@school.dk' },
    { id: '4', name: 'Peter Hansen', subject: 'History', class: '2B', email: 'peter.hansen@school.dk' },
  ];

  const recentMessages = [
    {
      id: 1,
      from: 'Anne Nielsen',
      subject: 'Class 3A Progress Update',
      preview: 'Students are showing excellent progress in mathematics...',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      from: 'Lars Pedersen',
      subject: 'English Reading Assessment Results',
      preview: 'The recent reading comprehension test results are...',
      time: '5 hours ago',
      unread: false
    },
    {
      id: 3,
      from: 'Maria Andersen',
      subject: 'Science Fair Preparation',
      preview: 'We need to discuss the upcoming science fair...',
      time: '1 day ago',
      unread: true
    },
  ];

  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleSendMessage = () => {
    if (messageContent.trim() && selectedTeachers.length > 0) {
      // In a real app, this would send the message
      setMessageContent("");
      setSelectedTeachers([]);
      alert("Message sent successfully!");
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
            <h1 className="text-3xl font-bold">Teacher Communications</h1>
            <p className="text-gray-400">Communicate and collaborate with teaching staff</p>
          </div>
        </div>

        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="messages" className="data-[state=active]:bg-purple-600">Messages</TabsTrigger>
            <TabsTrigger value="compose" className="data-[state=active]:bg-purple-600">Compose</TabsTrigger>
            <TabsTrigger value="directory" className="data-[state=active]:bg-purple-600">Teacher Directory</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        message.unread 
                          ? 'bg-blue-900/20 border-blue-500/30 hover:bg-blue-900/30' 
                          : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                            {message.from.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{message.from}</h4>
                            <h5 className="text-blue-400">{message.subject}</h5>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 text-sm">{message.time}</span>
                          {message.unread && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-1 ml-auto"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{message.preview}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compose" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  Compose Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Teachers</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {teachers.map((teacher) => (
                      <div 
                        key={teacher.id}
                        onClick={() => handleTeacherSelect(teacher.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedTeachers.includes(teacher.id)
                            ? 'bg-purple-600/20 border-purple-500/50'
                            : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                        }`}
                      >
                        <div className="font-medium text-white">{teacher.name}</div>
                        <div className="text-sm text-gray-400">{teacher.subject} - Class {teacher.class}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <Input 
                    placeholder="Enter message subject..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <Textarea 
                    placeholder="Type your message here..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                  />
                </div>

                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageContent.trim() || selectedTeachers.length === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="directory" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Teacher Directory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {teachers.map((teacher) => (
                    <div key={teacher.id} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-lg font-semibold">
                            {teacher.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{teacher.name}</h3>
                            <p className="text-gray-400">{teacher.subject} Teacher</p>
                            <p className="text-gray-400 text-sm">Class {teacher.class}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-600"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                          <p className="text-gray-400 text-xs mt-1">{teacher.email}</p>
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

export default TeacherCommunicationsPage;
