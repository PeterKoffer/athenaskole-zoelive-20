
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
          className="max-w-sm p-4 bg-white border border-gray-200 shadow-lg rounded-lg"
          sideOffset={10}
        >
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-base">
              {subject.title || 'Subject Title'}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {subject.description || 'Explore this exciting subject with interactive lessons and engaging activities.'}
            </p>
            {subject.keyAreas && subject.keyAreas.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">Key Areas:</p>
                <div className="flex flex-wrap gap-1">
                  {subject.keyAreas.slice(0, 3).map((area, idx) => (
                    <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">
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
