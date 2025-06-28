
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
    sm: 'w-8 h-8 text-2xl',
    md: 'w-12 h-12 text-3xl',
    lg: 'w-16 h-16 text-4xl',
    xl: 'w-20 h-20 text-5xl',
    '2xl': 'w-24 h-24 text-6xl',
    '3xl': 'w-32 h-32 text-7xl',
    '4xl': 'w-48 h-48 text-9xl'
  };

  console.log('🤖 RobotAvatar rendering with size:', size, 'isActive:', isActive, 'isSpeaking:', isSpeaking);

  return (
    <div className={cn(
      'flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-2xl border-4 border-white/20',
      sizeClasses[size],
      isActive && 'ring-4 ring-purple-400 ring-opacity-75 animate-pulse',
      isSpeaking && 'ring-4 ring-blue-400 animate-pulse',
      className
    )}>
      <span className="text-white filter drop-shadow-lg select-none">
        🤖
      </span>
    </div>
  );
};

export default RobotAvatar;
