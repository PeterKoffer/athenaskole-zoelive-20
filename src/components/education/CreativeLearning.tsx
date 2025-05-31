
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAdaptiveLearning } from "@/hooks/useAdaptiveLearning";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Music, Camera, Pen } from "lucide-react";
import SessionTimer from "../adaptive-learning/SessionTimer";
import LearningHeader from "./LearningHeader";

const CreativeLearning = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const { recommendedSessionTime } = useAdaptiveLearning('creative', 'general');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const activities = [
    {
      id: 'drawing',
      title: 'Digital Drawing',
      description: 'Create beautiful digital artwork',
      icon: Palette,
      color: 'from-pink-400 to-purple-600'
    },
    {
      id: 'music',
      title: 'Music Creation',
      description: 'Compose and play music',
      icon: Music,
      color: 'from-blue-400 to-cyan-600'
    },
    {
      id: 'photography',
      title: 'Photo Stories',
      description: 'Tell stories through images',
      icon: Camera,
      color: 'from-green-400 to-blue-600'
    },
    {
      id: 'writing',
      title: 'Creative Writing',
      description: 'Write stories and poems',
      icon: Pen,
      color: 'from-orange-400 to-pink-600'
    }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LearningHeader />
      <div className="max-w-6xl mx-auto p-6">
        <SessionTimer 
          recommendedDuration={recommendedSessionTime}
        />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Creative Learning</h1>
          <p className="text-gray-400 text-lg">Express yourself through art, music, and storytelling</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <Card key={activity.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${activity.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl">{activity.title}</h3>
                      <p className="text-gray-400 text-sm">{activity.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className={`w-full bg-gradient-to-r ${activity.color} hover:opacity-90 text-white border-none`}
                    onClick={() => setSelectedActivity(activity.id)}
                  >
                    Start Creating
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedActivity && (
          <Card className="mt-8 bg-gray-800 border-gray-700">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Coming Soon!</h3>
                <p className="text-gray-400 mb-6">
                  This creative activity is being developed. Check back soon for an amazing creative experience!
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedActivity(null)}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Back to Activities
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreativeLearning;
