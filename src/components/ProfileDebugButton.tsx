
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';

interface ProfileDebugButtonProps {
  onClick?: () => void;
  className?: string;
}

const ProfileDebugButton: React.FC<ProfileDebugButtonProps> = ({ 
  onClick, 
  className = "" 
}) => {
  const handleClick = () => {
    console.log('🐛 Profile Debug Button clicked');
    if (onClick) {
      onClick();
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <Bug className="w-4 h-4" />
      Debug Profile
    </Button>
  );
};

export default ProfileDebugButton;
