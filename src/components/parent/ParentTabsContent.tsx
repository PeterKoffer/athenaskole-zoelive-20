
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, MessageSquare } from "lucide-react";

interface Child {
  subjects: {
    [key: string]: {
      progress: number;
      recentActivity: string;
    };
  };
}

interface Message {
  from: string;
  subject: string;
  time: string;
  unread: boolean;
}

interface ParentTabsContentProps {
  selectedChild: Child;
  recentMessages: Message[];
}

const ParentTabsContent = ({ selectedChild, recentMessages }: ParentTabsContentProps) => {
  return (
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
  );
};

export default ParentTabsContent;
