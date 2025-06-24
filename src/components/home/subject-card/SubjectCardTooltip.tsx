
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
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-black/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 z-[999999] border-4 border-yellow-400 animate-fade-in pointer-events-none">
      <div className="text-center">
        <h4 className="font-bold text-yellow-400 mb-4 text-xl">
          {subject.title || 'Subject Title'}
        </h4>
        <p className="text-lg text-white leading-relaxed mb-6">
          {subject.description || 'Explore this exciting subject with interactive lessons and engaging activities.'}
        </p>
        {subject.keyAreas && subject.keyAreas.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-yellow-300 mb-3">Key Areas:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {subject.keyAreas.slice(0, 3).map((area, idx) => (
                <span key={idx} className="text-sm bg-yellow-500 text-black px-4 py-2 rounded-full font-bold">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectCardTooltip;
