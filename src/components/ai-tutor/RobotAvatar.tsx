
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
    // Enhanced fallback with larger, more visible chest blinking
    return (
      <div className={`${containerClasses} bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold relative overflow-hidden`}>
        <div className="text-8xl">🤖</div>
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Much larger and more visible blinking effect */}
            <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-cyan-400 rounded-full animate-pulse opacity-90 shadow-lg shadow-cyan-400/50"></div>
              <div className="absolute top-1 left-1 w-10 h-10 bg-blue-300 rounded-full animate-pulse opacity-80" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
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
      
      {/* Blinking animation positioned precisely on Nelie's belly dot */}
      {isSpeaking && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Position the blinking effect to match the round dot on Nelie's belly */}
          <div className="absolute top-[68%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Outer glow ring - sized to match the belly dot */}
              <div className="absolute -inset-1 bg-cyan-400 rounded-full animate-ping opacity-30"></div>
              
              {/* Main belly dot blinking effect - perfectly circular and sized to match */}
              <div className="w-6 h-6 bg-cyan-400 rounded-full animate-pulse opacity-95 shadow-lg shadow-cyan-400/60"></div>
              
              {/* Secondary pulsing layer - maintaining perfect circle */}
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-blue-300 rounded-full animate-pulse opacity-80" style={{ animationDelay: '0.25s' }}></div>
              
              {/* Bright center core - smaller and centered */}
              <div className="absolute top-1.5 left-1.5 w-3 h-3 bg-white rounded-full animate-pulse shadow-white/50 shadow-md" style={{ animationDelay: '0.5s' }}></div>
              
              {/* Inner sparkle effect - tiny center dot */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-200 rounded-full animate-pulse" style={{ animationDelay: '0.75s' }}></div>
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
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-cyan-400 font-bold animate-pulse">
          Speaking...
        </div>
      )}
    </div>
  );
};

export default RobotAvatar;
