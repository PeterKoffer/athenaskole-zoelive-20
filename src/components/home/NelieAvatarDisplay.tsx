
import RobotAvatar from "@/components/ai-tutor/RobotAvatar";

interface NelieAvatarDisplayProps {
  isSpeaking: boolean;
  onStopSpeech: () => void;
}

const NelieAvatarDisplay = ({ isSpeaking }: NelieAvatarDisplayProps) => {
  console.log('🤖 NelieAvatarDisplay rendering, isSpeaking:', isSpeaking);
  
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Main Nelie Avatar - Extra Large and Prominent */}
        <div className="relative">
          <RobotAvatar 
            size="4xl" 
            isActive={true} 
            isSpeaking={isSpeaking}
            className="drop-shadow-2xl transform hover:rotate-3 transition-transform duration-300"
          />
        </div>
        
        {/* Animated rings around Nelie */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 rounded-full border-4 border-purple-400 opacity-50 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border-2 border-blue-400 opacity-30 animate-ping animation-delay-1000"></div>
        </div>
        
        {/* Speech indicator when speaking */}
        {isSpeaking && (
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-4 h-4 bg-green-300 rounded-full animate-ping"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NelieAvatarDisplay;
