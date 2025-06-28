
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
      'flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-2xl border-4 border-white/20 overflow-hidden',
      sizeClasses[size],
      isActive && 'ring-4 ring-purple-400 ring-opacity-75 animate-pulse',
      isSpeaking && 'ring-4 ring-blue-400 animate-pulse',
      className
    )}>
      <img 
        src="/lovable-uploads/8c10bee3-a90a-42e9-9f33-382dd2fcd151.png"
        alt="Nelie AI Robot"
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error('Failed to load Nelie avatar image');
          // Fallback to another Nelie image if this one fails
          (e.target as HTMLImageElement).src = "/lovable-uploads/4dd9342c-d485-4995-b97f-3619b8452d16.png";
        }}
      />
    </div>
  );
};

export default RobotAvatar;
