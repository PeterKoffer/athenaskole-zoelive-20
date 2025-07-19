
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, Clock, Star, Brain } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  duration: string;
  level: string;
  color: string;
  aiEnhanced?: boolean;
  subject?: string;
  skillArea?: string;
}

interface AIEnhancedActivityCardProps {
  activity: Activity;
  onStartActivity: (activityId: string) => void;
}

const AIEnhancedActivityCard = ({ activity, onStartActivity }: AIEnhancedActivityCardProps) => {
  const IconComponent = activity.icon;

  const handleStart = () => {
    console.log(`🚀 Starting AI-enhanced activity: ${activity.id} - ${activity.title}`);
    console.log(`📚 Subject: ${activity.subject}, Skill Area: ${activity.skillArea}`);
    onStartActivity(activity.id);
  };

  return (
    <Card className={`${activity.color} border-2 border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{activity.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                  {activity.level}
                </Badge>
                {activity.aiEnhanced && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    AI Enhanced
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center text-white/80 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {activity.duration}
          </div>
        </div>
        
        <p className="text-white/90 text-sm mb-6 leading-relaxed">
          {activity.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-yellow-300">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4" />
            <Star className="w-4 h-4" />
          </div>
          <Button 
            onClick={handleStart}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-200"
          >
            Start Learning
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIEnhancedActivityCard;
