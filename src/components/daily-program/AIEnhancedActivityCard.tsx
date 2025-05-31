
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Brain, Sparkles } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  duration: string;
  level: string;
  color: string;
  aiEnhanced?: boolean;
}

interface AIEnhancedActivityCardProps {
  activity: Activity;
  onStartActivity: (activityId: string) => void;
}

const AIEnhancedActivityCard = ({ activity, onStartActivity }: AIEnhancedActivityCardProps) => {
  const IconComponent = activity.icon;

  return (
    <Card className={`bg-gray-800 border-gray-700 hover:border-purple-400 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
      activity.aiEnhanced ? 'ring-2 ring-purple-400/50' : ''
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${activity.color} relative`}>
              <IconComponent className="w-6 h-6" />
              {activity.aiEnhanced && (
                <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-bold">{activity.title}</h3>
                {activity.aiEnhanced && (
                  <Badge className="bg-purple-600 text-white text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                    AI
                  </Badge>
                )}
              </div>
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
        
        {activity.aiEnhanced && (
          <div className="mb-4 p-3 bg-purple-900/30 border border-purple-600/30 rounded-lg">
            <div className="flex items-center space-x-2 text-purple-300 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>AI-tilpasset til dit niveau</span>
            </div>
          </div>
        )}

        <Button 
          onClick={() => onStartActivity(activity.id)} 
          className={`w-full ${activity.aiEnhanced 
            ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90' 
            : `bg-gradient-to-r ${activity.color} hover:opacity-90`
          } text-white border-none`}
        >
          {activity.aiEnhanced && <Brain className="w-4 h-4 mr-2" />}
          Start {activity.title}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIEnhancedActivityCard;
