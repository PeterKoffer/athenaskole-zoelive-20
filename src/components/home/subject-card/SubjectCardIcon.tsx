
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
          <div className={`w-20 h-20 ${iconGradient} rounded-3xl flex items-center justify-center mb-4 mx-auto transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}>
            {IconComponent ? (
              <IconComponent size={32} className="text-white drop-shadow-lg" />
            ) : (
              <span className="text-2xl">{subject.icon || '📚'}</span>
            )}
          </div>
          
          {/* Subject Title */}
          <h3 className="text-lg font-bold text-white text-center mb-2 drop-shadow-lg">
            {subject.title}
          </h3>
        </div>
      </div>
    </SubjectCardTooltip>
  );
};

export default SubjectCardIcon;
