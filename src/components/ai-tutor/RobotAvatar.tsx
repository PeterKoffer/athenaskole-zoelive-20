
import { useState } from "react";

interface RobotAvatarProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
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
    "3xl": "w-60 h-60"
  };

  const containerClasses = `
    ${sizeClasses[size]} 
    rounded-full 
    flex items-center justify-center 
    transition-all duration-300 relative
    ${className}
  `;

  if (imageError) {
    // Enhanced fallback with mouth animation
    return (
      <div className={`${containerClasses} bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold relative overflow-hidden`}>
        <div className="text-6xl">🤖</div>
        {isSpeaking && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className="w-3 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
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
      
      {/* Animated mouth/speech indicator when speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Speaking mouth animation overlay */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
          
          {/* Subtle glow when speaking */}
          <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-pulse opacity-60"></div>
        </div>
      )}
      
      {/* Active status indicator (only when not speaking) */}
      {isActive && !isSpeaking && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-green-400 rounded-full"></div>
      )}
    </div>
  );
};

export default RobotAvatar;
