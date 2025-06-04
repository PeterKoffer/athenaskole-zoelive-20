
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

  if (imageError) {
    // Enhanced fallback with mouth animation
    return (
      <div className={`${containerClasses} bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold relative overflow-hidden`}>
        <div className="text-8xl">🤖</div>
        {isSpeaking && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              <div className="w-4 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-4 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-4 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
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
      
      {/* Animated mouth overlay when speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Mouth movement animation positioned over Nelie's mouth area */}
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              {/* Main mouth animation */}
              <div className="w-8 h-4 bg-pink-300 rounded-full opacity-80 animate-pulse"></div>
              {/* Inner mouth detail */}
              <div className="absolute top-1 left-2 w-4 h-2 bg-pink-400 rounded-full animate-bounce"></div>
              {/* Speech bubbles */}
              <div className="absolute -top-2 -right-2 flex space-x-1">
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Active status indicator (only when not speaking) - removed blinking effect */}
      {isActive && !isSpeaking && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-green-400 rounded-full"></div>
      )}
    </div>
  );
};

export default RobotAvatar;
