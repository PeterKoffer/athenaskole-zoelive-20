
import React from 'react';

interface CustomSpeakerIconProps {
  className?: string;
  size?: number;
}

const CustomSpeakerIcon = ({ className = '', size = 16 }: CustomSpeakerIconProps) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g>
        {/* Speaker cone */}
        <path 
          d="M25 35 L25 65 L45 65 L65 80 L65 20 L45 35 Z" 
          fill="currentColor"
        />
        {/* Sound waves */}
        <path 
          d="M72 35 Q80 42 80 50 Q80 58 72 65" 
          stroke="currentColor" 
          strokeWidth="3" 
          fill="none"
          strokeLinecap="round"
        />
        <path 
          d="M76 28 Q88 38 88 50 Q88 62 76 72" 
          stroke="currentColor" 
          strokeWidth="3" 
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export default CustomSpeakerIcon;
