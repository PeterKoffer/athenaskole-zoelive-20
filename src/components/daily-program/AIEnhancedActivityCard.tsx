
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { LucideIcon } from "lucide-react";
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

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
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  console.log('🎯 Activity card rendering:', {
    id: activity.id,
    title: activity.title,
    subject: activity.subject,
    skillArea: activity.skillArea
  });

  const handleStartActivity = () => {
    console.log(`🚀 Starting activity: ${activity.id} - ${activity.title}`);
    onStartActivity(activity.id);
  };

  const handleSpeakActivity = async () => {
    if (isSpeaking) {
      stop();
    } else {
      const speakText = `${activity.title}. ${activity.description}. Duration: ${activity.duration}. Level: ${activity.level}.`;
      await speakAsNelie(speakText, true, 'ai-enhanced-activity-card');
    }
  };

  return (
    <Card className={`relative bg-gray-800 border-gray-700 hover:border-purple-400 transition-all duration-300 cursor-pointer transform hover:scale-105`}>
      <button
        onClick={handleSpeakActivity}
        className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm border border-sky-400/30 opacity-90 hover:opacity-100"
        title="Ask Nelie to read this"
      >
        <CustomSpeakerIcon className="w-4 h-4" size={16} color="#0ea5e9" />
      </button>

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3 pr-12">
            <div className={`p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">{activity.title}</h3>
              <p className="text-gray-300 text-sm">{activity.description}</p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
              <Clock className="w-3 h-3 mr-1" />
              {activity.duration}
            </Badge>
            <Badge variant="outline" className="bg-blue-600 text-white border-blue-600">
              {activity.level}
            </Badge>
          </div>
        </div>

        <Button 
          onClick={handleStartActivity}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
        >
          Start {activity.title}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIEnhancedActivityCard;
