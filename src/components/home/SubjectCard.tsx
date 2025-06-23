
import React from 'react';
import { LucideIcon, Speaker } from 'lucide-react';

interface SubjectCardProps {
  title: string;
  icon: LucideIcon;
  gradient: string;
  bgColor: string;
  iconColor: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ title, icon: Icon, gradient, bgColor, iconColor }) => {
  return (
    <div className={`bg-white rounded-3xl p-8 relative overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-6 border-4 border-white/30
      shadow-[0_15px_50px_rgba(0,0,0,0.2),0_8px_25px_rgba(0,0,0,0.15),0_25px_80px_rgba(0,0,0,0.1)] 
      hover:shadow-[0_30px_100px_rgba(0,0,0,0.3),0_20px_50px_rgba(0,0,0,0.2),0_40px_120px_rgba(0,0,0,0.15)]
      before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:rounded-3xl before:pointer-events-none`}>
      
      {/* Cosmic background with stars */}
      <div className={`absolute inset-0 ${gradient} opacity-25 group-hover:opacity-35 transition-opacity duration-500`}></div>
      
      {/* Floating cosmic particles */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-300/60 rounded-full animate-pulse"></div>
      <div className="absolute top-12 right-8 w-1 h-1 bg-blue-300/80 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-16 left-8 w-1.5 h-1.5 bg-purple-300/70 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-8 right-6 w-1 h-1 bg-pink-300/60 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
      
      {/* Enhanced glass shine effect */}
      <div className="absolute top-6 left-6 w-10 h-10 bg-white/50 rounded-full blur-sm"></div>
      <div className="absolute top-8 left-8 w-6 h-6 bg-white/30 rounded-full blur-xs"></div>
      
      {/* Smaller 3D Speaker Icon with cosmic glow */}
      <div className="absolute top-4 right-4 transform transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform rotate-3 group-hover:rotate-6 transition-transform duration-300
          shadow-[0_8px_20px_rgba(0,0,0,0.25),0_3px_10px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.1)]
          hover:shadow-[0_12px_30px_rgba(147,51,234,0.3),0_6px_18px_rgba(59,130,246,0.2)]
          before:content-[''] before:absolute before:top-1.5 before:left-1.5 before:w-4 before:h-4 before:bg-white/60 before:rounded-full before:blur-sm
          after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-br after:from-cyan-400/20 after:to-purple-600/20 after:animate-pulse">
          <Speaker size={16} className="text-white drop-shadow-lg relative z-10" />
        </div>
      </div>
      
      {/* Maximum 3D Icon Container with cosmic universe theme */}
      <div className="relative z-10 mb-8">
        <div className="w-24 h-24 mx-auto mb-6 transform-gpu perspective-1000 relative">
          {/* Cosmic orbital ring */}
          <div className="absolute inset-0 border-2 border-gradient-to-r from-cyan-300/30 to-purple-400/30 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
          <div className="absolute inset-2 border border-gradient-to-r from-pink-300/20 to-blue-400/20 rounded-full animate-spin" style={{animationDuration: '12s', animationDirection: 'reverse'}}></div>
          
          <div className={`w-full h-full ${iconColor} rounded-3xl flex items-center justify-center transform transition-all duration-700 group-hover:rotate-y-15 group-hover:rotate-x-8 group-hover:scale-115 border-6 border-white/40 relative
            shadow-[0_20px_40px_rgba(0,0,0,0.25),0_10px_20px_rgba(0,0,0,0.15),inset_0_3px_0_rgba(255,255,255,0.5),inset_0_-3px_0_rgba(0,0,0,0.1)]
            group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.35),0_15px_30px_rgba(0,0,0,0.2)]
            before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:rounded-3xl
            after:content-[''] after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-br after:from-cyan-400/10 after:via-transparent after:to-purple-600/10 after:animate-pulse`}>
            
            {/* Icon with cosmic glow */}
            <Icon size={40} className="text-white drop-shadow-2xl relative z-10 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
            
            {/* Multiple shine effects for maximum cartoon depth */}
            <div className="absolute top-4 left-4 w-8 h-8 bg-white/60 rounded-full blur-sm"></div>
            <div className="absolute top-6 left-6 w-4 h-4 bg-white/40 rounded-full blur-xs"></div>
            
            {/* Cosmic sparkles */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-300/80 rounded-full animate-pulse"></div>
            <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-cyan-300/70 rounded-full animate-pulse" style={{animationDelay: '0.7s'}}></div>
          </div>
        </div>
        
        {/* Enhanced title with cosmic styling */}
        <h3 className="text-gray-800 text-xl font-bold text-center mb-8 group-hover:text-gray-700 transition-colors font-sans tracking-wide 
          drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]
          group-hover:text-shadow-[0_0_10px_rgba(147,51,234,0.3)]">
          {title}
        </h3>
      </div>
      
      {/* Maximum 3D Start Learning Button with cosmic universe theme - NO ROCKET */}
      <button className={`w-full py-5 px-6 ${gradient} text-white font-bold rounded-2xl transform transition-all duration-400 relative overflow-hidden group-hover:scale-105 border-4 border-white/30 text-lg
        shadow-[0_12px_30px_rgba(0,0,0,0.25),0_6px_15px_rgba(0,0,0,0.15),inset_0_3px_0_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(0,0,0,0.1)]
        hover:shadow-[0_20px_50px_rgba(147,51,234,0.35),0_10px_25px_rgba(59,130,246,0.2)]
        active:shadow-[0_6px_20px_rgba(0,0,0,0.25),0_3px_10px_rgba(0,0,0,0.15)]
        active:transform active:translateY-1
        before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-2xl before:pointer-events-none
        after:content-['✨'] after:absolute after:top-1/2 after:right-4 after:-translate-y-1/2 after:opacity-0 after:group-hover:opacity-100 after:transition-opacity after:duration-300`}>
        <span className="relative z-10 drop-shadow-lg">Start Learning!</span>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-2xl"></div>
        
        {/* Multiple button shine effects with cosmic theme */}
        <div className="absolute top-3 left-6 w-16 h-4 bg-white/50 rounded-full blur-sm"></div>
        <div className="absolute top-4 left-8 w-8 h-2 bg-white/30 rounded-full blur-xs"></div>
        
        {/* Floating cosmic particles on button */}
        <div className="absolute top-2 right-8 w-1 h-1 bg-yellow-300/60 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 left-12 w-1 h-1 bg-cyan-300/50 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </button>
    </div>
  );
};

export default SubjectCard;
