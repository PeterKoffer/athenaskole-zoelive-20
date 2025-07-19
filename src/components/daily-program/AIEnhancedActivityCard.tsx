
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, Clock, Star } from "lucide-react";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';

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

  const handleStart = () => {
    console.log(`🚀 Starting AI-enhanced activity: ${activity.id} - ${activity.title}`);
    console.log(`📚 Subject: ${activity.subject}, Skill Area: ${activity.skillArea}`);
    onStartActivity(activity.id);
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      stop();
    } else {
      // Create speech text that includes all the information from the removed badges
      let speechText = `${activity.title}. ${activity.description}. `;
      speechText += `This is a ${activity.level} level activity that takes ${activity.duration}. `;
      
      if (activity.aiEnhanced) {
        speechText += "This activity is AI Enhanced for personalized learning. ";
      }
      
      if (activity.subject) {
        speechText += `Subject: ${activity.subject}. `;
      }
      
      if (activity.skillArea) {
        speechText += `Skill area: ${activity.skillArea}. `;
      }

      await speakAsNelie(speechText, true, 'activity-card');
    }
  };

  return (
    <Card className={`relative ${activity.color} border-2 border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group`}>
      <button
        onClick={handleSpeak}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm border border-sky-400/30 opacity-0 hover:opacity-100 group-hover:opacity-100"
        title="Ask Nelie to read this"
      >
        <CustomSpeakerIcon className="w-4 h-4" size={16} color="#0ea5e9" />
      </button>

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{activity.title}</h3>
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
