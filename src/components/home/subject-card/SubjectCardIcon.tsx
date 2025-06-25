
import React, { useState } from 'react';
import { iconMap, iconGradientMap } from './subjectCardConstants';
import { SubjectCardIconProps } from './types';
import SubjectCardTooltip from './SubjectCardTooltip';

const SubjectCardIcon: React.FC<SubjectCardIconProps> = ({ 
  subject, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave 
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  
  const IconComponent = iconMap[subject.title];
  const iconGradient = iconGradientMap[subject.title] || 'bg-gradient-to-br from-blue-300/70 to-indigo-400/70';

  const handleMouseEnter = () => {
    console.log('🖱️ Mouse enter on icon:', subject.title);
    setTooltipVisible(true);
    onMouseEnter();
  };

  const handleMouseLeave = () => {
    console.log('🖱️ Mouse leave on icon:', subject.title);
    setTooltipVisible(false);
    onMouseLeave();
  };

  return (
    <SubjectCardTooltip 
      subject={subject} 
      isVisible={tooltipVisible}
    >
      <div className="relative">
        {/* Icon Container */}
        <div 
          className="relative mb-6"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`w-16 h-16 ${iconGradient} rounded-2xl flex items-center justify-center mb-4 mx-auto transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 border-2 border-white/30 relative
            shadow-[0_15px_30px_rgba(0,0,0,0.25),inset_0_2px_0_rgba(255,255,255,0.3)]
            before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-2xl`}>
            
            {IconComponent ? (
              <IconComponent size={28} className="text-white drop-shadow-xl relative z-10" />
            ) : (
              <span className="text-2xl">{subject.icon || '📚'}</span>
            )}
            
            {/* Shine effects */}
            <div className="absolute top-2 left-2 w-4 h-4 bg-white/40 rounded-full blur-sm"></div>
            <div className="absolute top-3 left-3 w-2 h-2 bg-white/20 rounded-full blur-xs"></div>
          </div>
          
          {/* Subject Title */}
          <h3 className="text-lg font-bold text-white text-center mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] min-h-[1.75rem] tracking-wide font-sans">
            {subject.title}
          </h3>
        </div>
      </div>
    </SubjectCardTooltip>
  );
};

export default SubjectCardIcon;
