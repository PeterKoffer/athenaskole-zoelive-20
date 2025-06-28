
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
        src="/lovable-uploads/5806da0a-9304-42c8-be57-d7072eb5fdf0.png"
        alt="Nelie AI Robot"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default RobotAvatar;
