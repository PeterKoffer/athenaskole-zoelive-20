
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
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-80 bg-gray-900/95 backdrop-blur-md shadow-2xl rounded-xl p-6 z-[99999] border-2 border-gray-700 animate-fade-in pointer-events-none">
      <h4 className="font-bold text-white mb-3 text-center text-lg">
        {subject.title || 'Subject Title'}
      </h4>
      <p className="text-sm text-gray-200 leading-relaxed mb-4 text-center">
        {subject.description || 'Explore this exciting subject with interactive lessons and engaging activities.'}
      </p>
      {subject.keyAreas && subject.keyAreas.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-300 mb-2 text-center">Key Areas:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {subject.keyAreas.slice(0, 3).map((area, idx) => (
              <span key={idx} className="text-xs bg-blue-600/80 text-blue-100 px-3 py-1 rounded-full font-medium">
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
