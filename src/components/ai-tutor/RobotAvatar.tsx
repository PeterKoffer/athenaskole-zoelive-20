
import { useState } from "react";

interface RobotAvatarProps {
  size?: "sm" | "md" | "lg";
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
    lg: "w-20 h-20"
  };

  const containerClasses = `
    ${sizeClasses[size]} 
    rounded-full 
    flex items-center justify-center 
    transition-all duration-300
    ${isActive ? 'animate-pulse' : ''}
    ${isSpeaking ? 'animate-bounce' : ''}
    ${className}
  `;

  if (imageError) {
    // Fallback to emoji if image fails to load
    return (
      <div className={`${containerClasses} bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold`}>
        🤖
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <img 
        src="/lovable-uploads/50b77ea0-3474-47cb-8e98-16b77f963d10.png"
        alt="Nelie AI Tutor Robot"
        className={`${sizeClasses[size]} object-contain`}
        onError={() => setImageError(true)}
        draggable={false}
      />
    </div>
  );
};

export default RobotAvatar;
