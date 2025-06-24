
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SubjectCardTooltipProps } from './types';

const SubjectCardTooltip: React.FC<SubjectCardTooltipProps> = ({ subject, isVisible, children }) => {
  console.log('🔍 SubjectCardTooltip render:', { 
    title: subject.title, 
    isVisible, 
    hasDescription: !!subject.description,
    hasKeyAreas: !!subject.keyAreas 
  });

  return (
    <TooltipProvider>
      <Tooltip open={isVisible}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-sm p-4 bg-gray-900 border border-gray-700 shadow-xl rounded-lg text-white"
          sideOffset={10}
        >
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-base">
              {subject.title || 'Subject Title'}
            </h4>
            <p className="text-sm text-gray-200 leading-relaxed">
              {subject.description || 'Explore this exciting subject with interactive lessons and engaging activities.'}
            </p>
            {subject.keyAreas && subject.keyAreas.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-300 mb-2">Key Areas:</p>
                <div className="flex flex-wrap gap-1">
                  {subject.keyAreas.slice(0, 3).map((area, idx) => (
                    <span key={idx} className="text-xs bg-blue-600 text-blue-100 px-2 py-1 rounded-md font-medium">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SubjectCardTooltip;
