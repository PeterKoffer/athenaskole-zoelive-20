
import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { SubjectCardProps } from './types';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import SubjectCardIcon from './SubjectCardIcon';
import SubjectCardButton from './SubjectCardButton';

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, index, onStartLearning }) => {
  const [isIconHovered, setIsIconHovered] = useState(false);
  const { speakAsNelie } = useUnifiedSpeech();

  const handleClick = () => {
    console.log(`🎯 SubjectCard: Navigating to ${subject.path} for ${subject.title}`);
    onStartLearning(subject.path);
  };

  const handleSpeakerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const speechText = `Let me tell you about ${subject.title}. ${subject.description}`;
    speakAsNelie(speechText, true, 'subject-introduction');
  };

  return (
    <div 
      className="relative group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-6"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Main Dark Card with Enhanced 3D Effects */}
      <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-3xl p-6 relative overflow-hidden
        shadow-[0_15px_50px_rgba(0,0,0,0.4),0_8px_25px_rgba(0,0,0,0.3),0_25px_80px_rgba(0,0,0,0.2)] 
        hover:shadow-[0_30px_100px_rgba(0,0,0,0.5),0_20px_50px_rgba(0,0,0,0.4),0_40px_120px_rgba(0,0,0,0.3)]
        before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-3xl before:pointer-events-none">
        
        {/* Subtle cosmic background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/3 to-pink-500/5 opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
        
        {/* Floating cosmic particles */}
        <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-300/30 rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-6 w-0.5 h-0.5 bg-blue-300/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-12 left-6 w-1 h-1 bg-purple-300/35 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>

        {/* Glass shine effect */}
        <div className="absolute top-4 left-4 w-6 h-6 bg-white/10 rounded-full blur-sm"></div>
        <div className="absolute top-5 left-5 w-3 h-3 bg-white/5 rounded-full blur-xs"></div>

        {/* Speaker Icon - top right corner */}
        <button
          onClick={handleSpeakerClick}
          className="absolute top-3 right-3 p-2 bg-gradient-to-br from-blue-300/80 via-purple-400/80 to-pink-400/80 rounded-xl transition-all duration-200 backdrop-blur-sm hover:scale-125 hover:rotate-12 z-10"
          title="Ask Nelie to explain this subject"
        >
          <Volume2 size={14} className="text-white drop-shadow-lg" />
        </button>

        {/* Icon Container with Hover Tooltip */}
        <SubjectCardIcon
          subject={subject}
          isHovered={isIconHovered}
          onMouseEnter={() => setIsIconHovered(true)}
          onMouseLeave={() => setIsIconHovered(false)}
        />
        
        {/* Start Learning Button */}
        <SubjectCardButton subject={subject} onClick={handleClick} />

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-black/5 rounded-3xl pointer-events-none"></div>
      </div>

      {/* Shadow layer */}
      <div className="absolute inset-0 bg-black/20 rounded-3xl transform translate-y-2 -z-10 blur-sm"></div>
    </div>
  );
};

export default SubjectCard;
