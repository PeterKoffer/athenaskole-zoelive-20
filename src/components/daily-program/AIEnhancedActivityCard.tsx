
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

// Enhanced button gradients similar to SubjectCard
const enhancedButtonGradientMap: Record<string, string> = {
  'mathematics': 'bg-gradient-to-br from-blue-300/80 to-blue-500/80',
  'english': 'bg-gradient-to-br from-purple-300/80 to-purple-500/80',
  'science': 'bg-gradient-to-br from-teal-300/80 to-green-500/80',
  'computer_science': 'bg-gradient-to-br from-yellow-300/80 to-orange-500/80',
  'music': 'bg-gradient-to-br from-violet-300/80 to-purple-500/80',
  'creative_arts': 'bg-gradient-to-br from-pink-300/80 to-rose-400/80'
};

const AIEnhancedActivityCard = ({ activity, onStartActivity }: AIEnhancedActivityCardProps) => {
  const IconComponent = activity.icon;
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  // Extract proper subject and skillArea from activity
  const activitySubject = activity.subject || activity.id || 'general';
  const activitySkillArea = activity.skillArea || 'mixed_topics';

  // Get enhanced button gradient based on activity ID
  const buttonGradient = enhancedButtonGradientMap[activity.id] || 'bg-gradient-to-br from-blue-300/80 to-blue-500/80';

  console.log('🎯 Activity card rendering:', {
    id: activity.id,
    title: activity.title,
    subject: activitySubject,
    skillArea: activitySkillArea
  });

  const handleStartActivity = () => {
    console.log(`🚀 Starting activity: ${activity.id} - ${activity.title} (Subject: ${activitySubject}, Skill: ${activitySkillArea})`);
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
    <Card className="relative bg-gray-800 border-gray-700 hover:border-purple-400 transition-all duration-300 cursor-pointer transform hover:scale-105">
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
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
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

        {/* Enhanced Button with SubjectCard styling */}
        <button 
          onClick={handleStartActivity}
          className={`w-full py-5 px-6 ${buttonGradient} text-white font-bold rounded-2xl transform transition-all duration-400 relative overflow-hidden hover:scale-105 border-3 border-white/20 text-lg
            shadow-[0_12px_30px_rgba(0,0,0,0.25),0_6px_15px_rgba(0,0,0,0.15),inset_0_3px_0_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.1)]
            hover:shadow-[0_20px_50px_rgba(147,51,234,0.25),0_10px_25px_rgba(59,130,246,0.15)]
            active:shadow-[0_6px_20px_rgba(0,0,0,0.25),0_3px_10px_rgba(0,0,0,0.15)]
            active:transform active:translateY-1
            before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:rounded-2xl before:pointer-events-none
            after:content-['✨'] after:absolute after:top-1/2 after:right-4 after:-translate-y-1/2 after:opacity-0 after:hover:opacity-100 after:transition-opacity after:duration-300 group`}
        >
          <span className="relative z-10 drop-shadow-lg">Start {activity.title}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-500/10 to-pink-400/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-2xl"></div>
          
          {/* Button shine effects */}
          <div className="absolute top-3 left-6 w-12 h-3 bg-white/30 rounded-full blur-sm"></div>
          <div className="absolute top-4 left-8 w-6 h-1.5 bg-white/15 rounded-full blur-xs"></div>
          
          {/* Floating particles on button */}
          <div className="absolute top-2 right-8 w-0.5 h-0.5 bg-yellow-300/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-12 w-0.5 h-0.5 bg-cyan-300/25 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </button>
      </CardContent>
    </Card>
  );
};

export default AIEnhancedActivityCard;
