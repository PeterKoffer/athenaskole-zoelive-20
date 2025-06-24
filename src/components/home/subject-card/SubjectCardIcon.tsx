
import React from 'react';
import { SubjectCardIconProps } from './types';
import { iconMap, iconGradientMap } from './subjectCardConstants';
import { Calculator } from 'lucide-react';
import SubjectCardTooltip from './SubjectCardTooltip';

const SubjectCardIcon: React.FC<SubjectCardIconProps> = ({ 
  subject, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave 
}) => {
  const Icon = iconMap[subject.title] || Calculator;
  const iconGradient = iconGradientMap[subject.title] || 'bg-gradient-to-br from-orange-300/70 to-red-400/70';

  return (
    <div className="relative z-10 mb-6">
      <div 
        className="w-16 h-16 mx-auto mb-4 transform-gpu perspective-1000 relative"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Hover Information Tooltip - positioned relative to icon */}
        <SubjectCardTooltip subject={subject} isVisible={isHovered} />

        {/* Cosmic orbital rings */}
        <div className="absolute inset-0 border border-gradient-to-r from-cyan-300/15 to-purple-400/15 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute inset-1 border border-gradient-to-r from-pink-300/10 to-blue-400/10 rounded-full animate-spin" style={{animationDuration: '12s', animationDirection: 'reverse'}}></div>
        
        <div className={`w-full h-full ${iconGradient} rounded-2xl flex items-center justify-center transform transition-all duration-700 group-hover:rotate-y-15 group-hover:rotate-x-8 group-hover:scale-115 border-3 border-white/30 relative
          shadow-[0_15px_30px_rgba(0,0,0,0.25),0_8px_15px_rgba(0,0,0,0.15),inset_0_2px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.1)]
          group-hover:shadow-[0_25px_45px_rgba(0,0,0,0.35),0_12px_25px_rgba(0,0,0,0.2)]
          before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-2xl
          after:content-[''] after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-br after:from-cyan-400/5 after:via-transparent after:to-purple-600/5 after:animate-pulse`}>
          
          {/* Icon - smaller */}
          <Icon size={28} className="text-white drop-shadow-xl relative z-10 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          
          {/* Shine effects - smaller */}
          <div className="absolute top-2 left-2 w-4 h-4 bg-white/40 rounded-full blur-sm"></div>
          <div className="absolute top-3 left-3 w-2 h-2 bg-white/20 rounded-full blur-xs"></div>
          
          {/* Cosmic sparkles */}
          <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-yellow-300/40 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-cyan-300/35 rounded-full animate-pulse" style={{animationDelay: '0.7s'}}></div>
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-white text-lg font-bold text-center mb-6 group-hover:text-gray-100 transition-colors font-sans tracking-wide 
        drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
        {subject.title}
      </h3>
    </div>
  );
};

export default SubjectCardIcon;
