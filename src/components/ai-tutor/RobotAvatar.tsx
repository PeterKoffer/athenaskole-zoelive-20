
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
      'flex items-center justify-center rounded-full shadow-2xl overflow-hidden relative',
      sizeClasses[size],
      className
    )}>
      <img 
        src="/lovable-uploads/8c10bee3-a90a-42e9-9f33-382dd2fcd151.png"
        alt="Nelie AI Robot"
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error('Failed to load Nelie avatar image');
          (e.target as HTMLImageElement).src = "/lovable-uploads/1bc3f66e-699d-4712-81bb-9188d2ddf964.png";
        }}
      />
    </div>
  );
};

export default RobotAvatar;
