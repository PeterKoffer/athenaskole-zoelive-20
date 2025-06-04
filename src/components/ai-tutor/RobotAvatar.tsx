
import { useState } from "react";

interface RobotAvatarProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  isActive?: boolean;
  isSpeaking?: boolean;
  className?: string;
}

const RobotAvatar = ({ 
  size = "md", 
  isActive = false, 
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

  console.log('🤖 RobotAvatar rendering - size:', size, 'isSpeaking:', isSpeaking, 'isActive:', isActive);

  if (imageError) {
    // Enhanced fallback with chest hole blinking
    return (
      <div className={`${containerClasses} bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold relative overflow-hidden`}>
        <div className="text-8xl">🤖</div>
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse opacity-80"></div>
            </div>
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
      
      {/* Chest hole blinking animation when speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Chest hole area - positioned over Nelie's chest */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8">
            <div className="relative">
              {/* Main chest hole blinking effect */}
              <div className="w-6 h-6 bg-blue-400 rounded-full animate-pulse opacity-90"></div>
              {/* Inner glow effect */}
              <div className="absolute top-1 left-1 w-4 h-4 bg-blue-300 rounded-full animate-pulse opacity-70" style={{ animationDelay: '0.5s' }}></div>
              {/* Center core */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.25s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Active status indicator (only when not speaking) */}
      {isActive && !isSpeaking && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
      )}
      
      {/* Speaking indicator text for debugging */}
      {isSpeaking && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-blue-400 font-bold animate-pulse">
          Speaking...
        </div>
      )}
    </div>
  );
};

export default RobotAvatar;
