
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
        <RobotAvatar 
          size="4xl" 
          isActive={true} 
          isSpeaking={isSpeaking}
          className="drop-shadow-2xl animate-pulse"
        />
        {/* Fallback if RobotAvatar doesn't show */}
        <div className="absolute inset-0 flex items-center justify-center text-6xl animate-bounce">
          🤖
        </div>
      </div>
    </div>
  );
};

export default NelieAvatarDisplay;
