
import React from 'react';
import { SubjectCardTooltipProps } from './types';

const SubjectCardTooltip: React.FC<SubjectCardTooltipProps> = ({ subject, isVisible }) => {
  console.log('🔍 SubjectCardTooltip render:', { 
    title: subject.title, 
    isVisible, 
    hasDescription: !!subject.description,
    hasKeyAreas: !!subject.keyAreas 
  });
  
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-black/95 backdrop-blur-md shadow-2xl rounded-2xl p-6 z-[99999] border-2 border-white/20 animate-fade-in pointer-events-none">
      <h4 className="font-bold text-white mb-3 text-center text-lg">
        {subject.title || 'Subject Title'}
      </h4>
      <p className="text-sm text-white/90 leading-relaxed mb-4 text-center">
        {subject.description || 'Explore this exciting subject with interactive lessons and engaging activities.'}
      </p>
      {subject.keyAreas && subject.keyAreas.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-white/80 mb-2 text-center">Key Areas:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {subject.keyAreas.slice(0, 3).map((area, idx) => (
              <span key={idx} className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-medium">
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Tooltip arrow pointing down */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-black/95"></div>
    </div>
  );
};

export default SubjectCardTooltip;
