import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Calculator, Globe, Palette, Target, Clock, Star } from "lucide-react";

const DailyProgram = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  
  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'Student';
  
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const todaysDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const dailyActivities = [{
    id: "matematik",
    title: "Mathematics",
    description: "Work with fractions and geometry",
    icon: <Calculator className="w-6 h-6" />,
    duration: "30 min",
    level: "Foundation",
    color: "from-blue-400 to-blue-600"
  }, {
    id: "dansk",
    title: "English",
    description: "Read stories and practice spelling",
    icon: <BookOpen className="w-6 h-6" />,
    duration: "25 min",
    level: "Foundation",
    color: "from-green-400 to-green-600"
  }, {
    id: "engelsk",
    title: "Foreign Language",
    description: "Learn new words and pronunciation",
    icon: <Globe className="w-6 h-6" />,
    duration: "20 min",
    level: "Foundation",
    color: "from-purple-400 to-purple-600"
  }, {
    id: "kreativ",
    title: "Creative Time",
    description: "Draw and write stories",
    icon: <Palette className="w-6 h-6" />,
    duration: "15 min",
    level: "Foundation",
    color: "from-pink-400 to-pink-600"
  }];

  const handleStartActivity = (activityId: string) => {
    setSelectedActivity(activityId);
    // Navigate to the specific educational component
    navigate(`/learn/${activityId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Nelie's Welcome */}
        <Card className="bg-gradient-to-r from-purple-600 to-cyan-600 border-none mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-white">
              <div className="text-4xl">🎓</div>
              <div>
                <h1 className="text-2xl font-bold">Hi {firstName}! I'm Nelie</h1>
                <p className="text-purple-100">{todaysDate}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-lg mb-4">
                Welcome to your personal learning day! I have prepared an exciting program for you. 
                You can choose where you want to start, and I will guide you through each activity.
              </p>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="text-sm">You have 4 activities to choose from today!</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Program */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Target className="w-6 h-6 text-cyan-400" />
            <span>Today's Program</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {dailyActivities.map(activity => (
              <Card key={activity.id} className="bg-gray-800 border-gray-700 hover:border-purple-400 transition-all duration-300 cursor-pointer transform hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${activity.color}`}>
                        {activity.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{activity.title}</h3>
                        <p className="text-gray-300 text-sm">{activity.description}</p>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.duration}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-600 text-white border-blue-600">
                        {activity.level}
                      </Badge>
                    </div>
                  </div>
                  <Button onClick={() => handleStartActivity(activity.id)} className={`w-full bg-gradient-to-r ${activity.color} hover:opacity-90 text-white border-none`}>
                    Start {activity.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Nelie's Tips */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <span className="text-2xl">💡</span>
              <span>Nelie's Tips for Today</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-300">
              <li>• Start with the subject you find hardest - then you'll get it done!</li>
              <li>• Remember to take breaks between activities</li>
              <li>• Say 'hi Nelie' if you need help along the way</li>
              <li>• Try speaking out loud when practicing languages - it helps with pronunciation!</li>
            </ul>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate('/')} className="border-gray-600 text-slate-950 bg-sky-50">
            Back to home page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DailyProgram;
