
import React from 'react';
import { SubjectCardButtonProps } from './types';
import { buttonGradientMap } from './subjectCardConstants';

const SubjectCardButton: React.FC<SubjectCardButtonProps> = ({ subject, onClick }) => {
  const buttonGradient = buttonGradientMap[subject.title] || 'bg-gradient-to-br from-blue-300/80 to-blue-500/80';

  return (
    <button 
      onClick={onClick}
      className={`w-full py-4 px-6 ${buttonGradient} text-white font-bold rounded-2xl transform transition-all duration-400 relative overflow-hidden group-hover:scale-105 border-2 border-white/20 text-base
        shadow-[0_10px_25px_rgba(0,0,0,0.25),0_5px_12px_rgba(0,0,0,0.15),inset_0_2px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)]
        hover:shadow-[0_15px_40px_rgba(147,51,234,0.25),0_8px_20px_rgba(59,130,246,0.15)]
        active:shadow-[0_5px_15px_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.15)]
        active:transform active:translateY-1
        before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:rounded-2xl before:pointer-events-none
        after:content-['✨'] after:absolute after:top-1/2 after:right-4 after:-translate-y-1/2 after:opacity-0 after:group-hover:opacity-100 after:transition-opacity after:duration-300`}
    >
      <span className="relative z-10 drop-shadow-lg">Start Learning!</span>
      
      {/* Button shine effects */}
      <div className="absolute top-2 left-4 w-10 h-2 bg-white/30 rounded-full blur-sm"></div>
      <div className="absolute top-3 left-6 w-5 h-1 bg-white/15 rounded-full blur-xs"></div>
      
      {/* Floating particles on button */}
      <div className="absolute top-1 right-6 w-0.5 h-0.5 bg-yellow-300/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1 left-8 w-0.5 h-0.5 bg-cyan-300/25 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
    </button>
  );
};

export default SubjectCardButton;
