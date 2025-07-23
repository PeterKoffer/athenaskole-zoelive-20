
import { useState } from "react";

interface RobotAvatarProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  isActive?: boolean;
  isSpeaking?: boolean;
  className?: string;
}

const RobotAvatar = ({ 
  size = "md", 
  isSpeaking = false, 
  className = "" 
}: RobotAvatarProps) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
    "2xl": "w-40 h-40",
    "3xl": "w-60 h-60",
    "4xl": "w-80 h-80"
  };

  const containerClasses = `
    ${sizeClasses[size]} 
    rounded-full 
    flex items-center justify-center 
    transition-all duration-300 relative
    ${className}
  `;

  if (imageError) {
    // Fallback to show a proper robot representation
    return (
      <div className={`${containerClasses} bg-gradient-to-br from-cyan-400 to-purple-500 text-white font-bold relative overflow-hidden`}>
        <div className="text-6xl">🤖</div>
        {isSpeaking && (
          <div className="absolute top-[65%] left-[55%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse opacity-95"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${containerClasses} relative overflow-hidden`}>
      <img 
        src="/lovable-uploads/50b77ea0-3474-47cb-8e98-16b77f963d10.png"
        alt="Nelie AI Tutor Robot"
        className={`${sizeClasses[size]} object-contain`}
        onError={() => setImageError(true)}
        draggable={false}
      />
      
      {/* Blinking animation for when speaking */}
      {isSpeaking && (
        <div className="absolute top-[65%] left-[55%] transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-cyan-400 rounded-full animate-pulse opacity-95 shadow-lg shadow-cyan-400/60"></div>
        </div>
      )}
    </div>
  );
};

export default RobotAvatar;
