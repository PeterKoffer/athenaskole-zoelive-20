
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SubjectCardTooltipProps } from './types';

const SubjectCardTooltip: React.FC<SubjectCardTooltipProps> = ({ subject, isVisible, children }) => {
  console.log('🔍 SubjectCardTooltip render:', { 
    title: subject.title, 
    isVisible
  });

  return (
    <TooltipProvider>
      <Tooltip open={isVisible}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="z-[9999] max-w-sm p-4 bg-slate-900 border border-slate-700 shadow-2xl rounded-lg text-white font-medium"
          sideOffset={12}
        >
          <div className="space-y-3">
            <h4 className="font-bold text-white text-lg leading-tight">
              {subject.title}
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {subject.description || 'Explore this exciting subject with interactive lessons and engaging activities.'}
            </p>
            {subject.keyAreas && subject.keyAreas.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">Key Areas:</p>
                <div className="flex flex-wrap gap-1.5">
                  {subject.keyAreas.slice(0, 3).map((area, idx) => (
                    <span key={idx} className="text-xs bg-blue-600 text-blue-100 px-2.5 py-1 rounded-full font-semibold">
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
