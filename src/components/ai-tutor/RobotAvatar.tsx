
import React from 'react';
import { cn } from '@/lib/utils';

interface RobotAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  isActive?: boolean;
  isSpeaking?: boolean;
  className?: string;
}

const RobotAvatar: React.FC<RobotAvatarProps> = ({
  size = 'md',
  isActive = false,
  isSpeaking = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
    '3xl': 'w-32 h-32',
    '4xl': 'w-48 h-48'
  };

  console.log('🤖 RobotAvatar rendering with size:', size, 'isActive:', isActive, 'isSpeaking:', isSpeaking);

  return (
    <div className={cn(
      'flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 shadow-2xl border-4 border-white/20 overflow-hidden relative',
      sizeClasses[size],
      isActive && 'ring-4 ring-blue-400 ring-opacity-75 animate-pulse',
      isSpeaking && 'ring-4 ring-cyan-400 animate-pulse',
      className
    )}>
      <img 
        src="/lovable-uploads/8c10bee3-a90a-42e9-9f33-382dd2fcd151.png"
        alt="Nelie AI Robot"
        className="w-full h-full object-cover scale-110"
        onError={(e) => {
          console.error('Failed to load Nelie avatar image');
          // Fallback to another available Nelie image if this one fails
          (e.target as HTMLImageElement).src = "/lovable-uploads/1bc3f66e-699d-4712-81bb-9188d2ddf964.png";
        }}
      />
      
      {/* Blinking dot when speaking */}
      {isSpeaking && (
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full animate-ping shadow-lg"></div>
      )}
      
      {/* Subtle glow effect when active */}
      {isActive && (
        <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-pulse"></div>
      )}
    </div>
  );
};

export default RobotAvatar;
