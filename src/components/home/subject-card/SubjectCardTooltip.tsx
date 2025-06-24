
import React from 'react';
import { SubjectCardTooltipProps } from './types';

const SubjectCardTooltip: React.FC<SubjectCardTooltipProps> = ({ subject, isVisible }) => {
  console.log('🔍 SubjectCardTooltip render:', { subject, isVisible });
  
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900/95 backdrop-blur-md shadow-xl rounded-2xl p-4 z-50 border border-gray-700 animate-fade-in">
      <h4 className="font-semibold text-white mb-2 text-center text-base">
        {subject.title || 'Subject Title'}
      </h4>
      <p className="text-sm text-gray-300 leading-relaxed mb-3">
        {subject.description || 'No description available.'}
      </p>
      {subject.keyAreas && subject.keyAreas.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 mb-2">Key Areas:</p>
          <div className="flex flex-wrap gap-1">
            {subject.keyAreas.slice(0, 3).map((area, idx) => (
              <span key={idx} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Tooltip arrow pointing down */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900/95"></div>
    </div>
  );
};

export default SubjectCardTooltip;
