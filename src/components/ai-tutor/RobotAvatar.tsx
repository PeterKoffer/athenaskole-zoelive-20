
import { useState } from "react";

interface RobotAvatarProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
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
    "2xl": "w-40 h-40"
  };

  const containerClasses = `
    ${sizeClasses[size]} 
    rounded-full 
    flex items-center justify-center 
    transition-all duration-300 relative
    ${isActive ? 'animate-pulse' : ''}
    ${isSpeaking ? 'animate-bounce' : ''}
    ${className}
  `;

  if (imageError) {
    // Enhanced fallback with mouth animation
    return (
      <div className={`${containerClasses} bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold relative overflow-hidden`}>
        <div className="text-4xl">🤖</div>
        {isSpeaking && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-1 bg-red-400 rounded-full animate-pulse"></div>
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
        className={`${sizeClasses[size]} object-contain ${isSpeaking ? 'animate-pulse' : ''}`}
        onError={() => setImageError(true)}
        draggable={false}
      />
      
      {/* Animated mouth/speech indicator when speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Speaking animation overlay */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
          
          {/* Pulsing border when speaking */}
          <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75"></div>
        </div>
      )}
      
      {/* Active status indicator */}
      {isActive && !isSpeaking && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

export default RobotAvatar;
