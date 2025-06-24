
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

// Icon gradients matching the second image style
const iconGradientMap: Record<string, string> = {
  'mathematics': 'bg-gradient-to-br from-orange-300/70 to-red-400/70',
  'english': 'bg-gradient-to-br from-blue-300/70 to-indigo-400/70',
  'science': 'bg-gradient-to-br from-green-300/70 to-emerald-400/70',
  'computer-science': 'bg-gradient-to-br from-yellow-300/70 to-amber-400/70',
  'music': 'bg-gradient-to-br from-purple-300/70 to-violet-400/70',
  'creative-arts': 'bg-gradient-to-br from-pink-300/70 to-purple-400/70'
};

// Button gradients matching the second image style
const buttonGradientMap: Record<string, string> = {
  'mathematics': 'bg-gradient-to-br from-blue-300/80 to-blue-500/80',
  'english': 'bg-gradient-to-br from-purple-300/80 to-purple-500/80',
  'science': 'bg-gradient-to-br from-teal-300/80 to-green-500/80',
  'computer-science': 'bg-gradient-to-br from-yellow-300/80 to-orange-500/80',
  'music': 'bg-gradient-to-br from-violet-300/80 to-purple-500/80',
  'creative-arts': 'bg-gradient-to-br from-pink-300/80 to-rose-400/80'
};

const AIEnhancedActivityCard = ({ activity, onStartActivity }: AIEnhancedActivityCardProps) => {
  const IconComponent = activity.icon;
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  // Extract proper subject and skillArea from activity
  const activitySubject = activity.subject || activity.id || 'general';
  const activitySkillArea = activity.skillArea || 'mixed_topics';

  // Get icon and button gradients based on activity ID
  const iconGradient = iconGradientMap[activity.id] || 'bg-gradient-to-br from-orange-300/70 to-red-400/70';
  const buttonGradient = buttonGradientMap[activity.id] || 'bg-gradient-to-br from-blue-300/80 to-blue-500/80';

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
      const speakText = `${activity.title}. ${activity.description}.`;
      await speakAsNelie(speakText, true, 'ai-enhanced-activity-card');
    }
  };

  return (
    <div 
      className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-1"
    >
      {/* Main Card with smaller styling */}
      <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-2xl p-4 relative overflow-hidden
        shadow-[0_8px_30px_rgba(0,0,0,0.4),0_4px_15px_rgba(0,0,0,0.3)] 
        hover:shadow-[0_15px_50px_rgba(0,0,0,0.5),0_10px_25px_rgba(0,0,0,0.4)]
        before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-2xl before:pointer-events-none">
        
        {/* Subtle background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/3 to-pink-500/5 opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
        
        {/* Floating particles */}
        <div className="absolute top-2 left-2 w-0.5 h-0.5 bg-yellow-300/30 rounded-full animate-pulse"></div>
        <div className="absolute top-6 right-4 w-0.5 h-0.5 bg-blue-300/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-8 left-4 w-0.5 h-0.5 bg-purple-300/35 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>

        {/* Speaker Icon */}
        <button
          onClick={handleSpeakActivity}
          className="absolute top-2 right-2 p-1.5 bg-gradient-to-br from-blue-300/80 via-purple-400/80 to-pink-400/80 rounded-lg transition-all duration-200 backdrop-blur-sm hover:scale-110 hover:rotate-12"
          title="Ask Nelie to explain this activity"
        >
          <CustomSpeakerIcon className="w-3 h-3" size={12} color="white" />
        </button>

        {/* Icon Container */}
        <div className="relative z-10 mb-3">
          <div className="w-12 h-12 mx-auto mb-2 transform-gpu perspective-1000 relative">
            <div className={`w-full h-full ${iconGradient} rounded-xl flex items-center justify-center transform transition-all duration-700 group-hover:scale-110 border-2 border-white/30 relative
              shadow-[0_8px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.3)]
              before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-xl`}>
              
              <IconComponent size={20} className="text-white drop-shadow-lg relative z-10" />
              
              {/* Shine effects */}
              <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full blur-sm"></div>
              <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-white/20 rounded-full blur-xs"></div>
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-white text-sm font-bold text-center mb-2 group-hover:text-gray-100 transition-colors font-sans tracking-wide 
            drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            {activity.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-300 text-xs text-center mb-4 leading-relaxed">
            {activity.description}
          </p>
        </div>
        
        {/* Start Learning Button - moved up since badges are removed */}
        <button 
          onClick={handleStartActivity}
          className={`w-full py-2.5 px-4 ${buttonGradient} text-white font-semibold rounded-xl transform transition-all duration-400 relative overflow-hidden group-hover:scale-105 border border-white/20 text-sm
            shadow-[0_6px_20px_rgba(0,0,0,0.25),0_3px_10px_rgba(0,0,0,0.15),inset_0_2px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)]
            hover:shadow-[0_10px_30px_rgba(147,51,234,0.25),0_5px_15px_rgba(59,130,246,0.15)]
            active:shadow-[0_3px_10px_rgba(0,0,0,0.25),0_1px_5px_rgba(0,0,0,0.15)]
            active:transform active:translateY-0.5
            before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:rounded-xl before:pointer-events-none
            after:content-['✨'] after:absolute after:top-1/2 after:right-3 after:-translate-y-1/2 after:opacity-0 after:group-hover:opacity-100 after:transition-opacity after:duration-300`}
        >
          <span className="relative z-10 drop-shadow-sm">Start {activity.title.split(' ')[0]}!</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-500/10 to-pink-400/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-xl"></div>
          
          {/* Button shine effects */}
          <div className="absolute top-1.5 left-3 w-6 h-1.5 bg-white/30 rounded-full blur-sm"></div>
          <div className="absolute top-2 left-4 w-3 h-0.5 bg-white/15 rounded-full blur-xs"></div>
          
          {/* Floating particles on button */}
          <div className="absolute top-1 right-4 w-0.5 h-0.5 bg-yellow-300/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1 left-6 w-0.5 h-0.5 bg-cyan-300/25 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </button>

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-black/5 rounded-2xl pointer-events-none"></div>
      </div>

      {/* Shadow layer */}
      <div className="absolute inset-0 bg-black/20 rounded-2xl transform translate-y-1 -z-10 blur-sm"></div>
    </div>
  );
};

export default AIEnhancedActivityCard;
