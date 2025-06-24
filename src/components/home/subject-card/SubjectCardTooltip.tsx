
import React from 'react';
import { SubjectCardTooltipProps } from './types';

const SubjectCardTooltip: React.FC<SubjectCardTooltipProps> = ({ subject, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-80 bg-gray-900/95 backdrop-blur-md shadow-xl rounded-2xl p-4 z-30 border border-gray-700 animate-fade-in">
      <h4 className="font-semibold text-white mb-2 text-center">{subject.title}</h4>
      <p className="text-sm text-gray-300 leading-relaxed mb-3">{subject.description}</p>
      {subject.keyAreas && (
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
    </div>
  );
};

export default SubjectCardTooltip;
