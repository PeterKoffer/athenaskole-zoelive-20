
import React, { useState } from 'react';
import { Calculator, BookOpen, Laptop, Zap, Palette, Music, Brain, Globe, Dumbbell, Target, Languages, Scroll, Volume2, ChevronDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Subject } from './SubjectsData';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SubjectCardProps {
  subject: Subject;
  index: number;
  onStartLearning: (path: string) => void;
}

// Map subject titles to icons
const iconMap: Record<string, LucideIcon> = {
  'Mathematics': Calculator,
  'English Language Arts': BookOpen,
  'Science & Technology': Laptop,
  'Computer Science': Zap,
  'Creative Arts': Palette,
  'Music Discovery': Music,
  'Mental Wellness': Brain,
  'Language Lab': Languages,
  'History & Religion': Scroll,
  'Global Geography': Globe,
  'BodyLab': Dumbbell,
  'Life Essentials': Target
};

// Desaturated iOS-style gradient backgrounds for icons
const iconGradientMap: Record<string, string> = {
  'Mathematics': 'bg-gradient-to-br from-orange-300/70 to-red-400/70',
  'English Language Arts': 'bg-gradient-to-br from-blue-300/70 to-indigo-400/70',
  'Science & Technology': 'bg-gradient-to-br from-green-300/70 to-emerald-400/70',
  'Computer Science': 'bg-gradient-to-br from-yellow-300/70 to-amber-400/70',
  'Creative Arts': 'bg-gradient-to-br from-pink-300/70 to-purple-400/70',
  'Music Discovery': 'bg-gradient-to-br from-purple-300/70 to-violet-400/70',
  'Mental Wellness': 'bg-gradient-to-br from-green-300/70 to-emerald-400/70',
  'Language Lab': 'bg-gradient-to-br from-blue-300/70 to-cyan-400/70',
  'History & Religion': 'bg-gradient-to-br from-orange-300/70 to-red-400/70',
  'Global Geography': 'bg-gradient-to-br from-blue-300/70 to-green-400/70',
  'BodyLab': 'bg-gradient-to-br from-red-300/70 to-orange-400/70',
  'Life Essentials': 'bg-gradient-to-br from-red-300/70 to-pink-400/70'
};

// Desaturated button gradients
const buttonGradientMap: Record<string, string> = {
  'Mathematics': 'bg-gradient-to-br from-blue-300/80 to-blue-500/80',
  'English Language Arts': 'bg-gradient-to-br from-purple-300/80 to-purple-500/80',
  'Science & Technology': 'bg-gradient-to-br from-teal-300/80 to-green-500/80',
  'Computer Science': 'bg-gradient-to-br from-yellow-300/80 to-orange-500/80',
  'Creative Arts': 'bg-gradient-to-br from-pink-300/80 to-rose-400/80',
  'Music Discovery': 'bg-gradient-to-br from-violet-300/80 to-purple-500/80',
  'Mental Wellness': 'bg-gradient-to-br from-emerald-300/80 to-teal-400/80',
  'Language Lab': 'bg-gradient-to-br from-cyan-300/80 to-blue-400/80',
  'History & Religion': 'bg-gradient-to-br from-amber-300/80 to-orange-400/80',
  'Global Geography': 'bg-gradient-to-br from-sky-300/80 to-blue-400/80',
  'BodyLab': 'bg-gradient-to-br from-red-300/80 to-pink-400/80',
  'Life Essentials': 'bg-gradient-to-br from-indigo-300/80 to-purple-400/80'
};

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, index, onStartLearning }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { speakAsNelie } = useUnifiedSpeech();
  
  const Icon = iconMap[subject.title] || Calculator;
  const iconGradient = iconGradientMap[subject.title] || 'bg-gradient-to-br from-orange-300/70 to-red-400/70';
  const buttonGradient = buttonGradientMap[subject.title] || 'bg-gradient-to-br from-blue-300/80 to-blue-500/80';

  const handleClick = () => {
    console.log(`🎯 SubjectCard: Navigating to ${subject.path} for ${subject.title}`);
    onStartLearning(subject.path);
  };

  const handleSpeakerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const speechText = `Let me tell you about ${subject.title}. ${subject.description}`;
    speakAsNelie(speechText, true, 'subject-introduction');
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div 
      className="relative group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-6"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Main Dark Card with Enhanced 3D Effects */}
      <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-3xl p-8 relative overflow-hidden
        shadow-[0_15px_50px_rgba(0,0,0,0.4),0_8px_25px_rgba(0,0,0,0.3),0_25px_80px_rgba(0,0,0,0.2)] 
        hover:shadow-[0_30px_100px_rgba(0,0,0,0.5),0_20px_50px_rgba(0,0,0,0.4),0_40px_120px_rgba(0,0,0,0.3)]
        before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-3xl before:pointer-events-none">
        
        {/* Subtle cosmic background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/3 to-pink-500/5 opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
        
        {/* Reduced floating cosmic particles */}
        <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-300/30 rounded-full animate-pulse"></div>
        <div className="absolute top-12 right-8 w-0.5 h-0.5 bg-blue-300/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-16 left-8 w-1 h-1 bg-purple-300/35 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-8 right-6 w-0.5 h-0.5 bg-pink-300/30 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>

        {/* Reduced glass shine effect */}
        <div className="absolute top-6 left-6 w-8 h-8 bg-white/10 rounded-full blur-sm"></div>
        <div className="absolute top-8 left-8 w-4 h-4 bg-white/5 rounded-full blur-xs"></div>

        {/* Speaker Icon - same size as dropdown and horizontally aligned */}
        <button
          onClick={handleSpeakerClick}
          className="absolute top-4 right-16 p-2 bg-gradient-to-br from-blue-300/80 via-purple-400/80 to-pink-400/80 rounded-xl transition-all duration-200 backdrop-blur-sm hover:scale-125 hover:rotate-12"
          title="Ask Nelie to explain this subject"
        >
          <Volume2 size={16} className="text-white drop-shadow-lg" />
        </button>

        {/* Dropdown Menu with dark background */}
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button
              onClick={handleDropdownClick}
              className="absolute top-4 right-4 p-2 bg-purple-500/60 hover:bg-purple-600/60 rounded-xl transition-all duration-200 backdrop-blur-sm"
              title="More information"
            >
              <ChevronDown size={16} className="text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-gray-900/95 backdrop-blur-md shadow-xl rounded-2xl z-50 border-gray-700">
            <DropdownMenuItem className="p-4 cursor-default hover:bg-gray-800/50">
              <div className="space-y-2">
                <h4 className="font-semibold text-white">{subject.title}</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{subject.description}</p>
                {subject.keyAreas && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-400 mb-1">Key Areas:</p>
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
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Icon Container with reduced cosmic effects */}
        <div className="relative z-10 mb-8">
          <div className="w-24 h-24 mx-auto mb-6 transform-gpu perspective-1000 relative">
            {/* Reduced cosmic orbital ring */}
            <div className="absolute inset-0 border border-gradient-to-r from-cyan-300/15 to-purple-400/15 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
            <div className="absolute inset-2 border border-gradient-to-r from-pink-300/10 to-blue-400/10 rounded-full animate-spin" style={{animationDuration: '12s', animationDirection: 'reverse'}}></div>
            
            <div className={`w-full h-full ${iconGradient} rounded-3xl flex items-center justify-center transform transition-all duration-700 group-hover:rotate-y-15 group-hover:rotate-x-8 group-hover:scale-115 border-4 border-white/30 relative
              shadow-[0_20px_40px_rgba(0,0,0,0.25),0_10px_20px_rgba(0,0,0,0.15),inset_0_3px_0_rgba(255,255,255,0.3),inset_0_-3px_0_rgba(0,0,0,0.1)]
              group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.35),0_15px_30px_rgba(0,0,0,0.2)]
              before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-3xl
              after:content-[''] after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-br after:from-cyan-400/5 after:via-transparent after:to-purple-600/5 after:animate-pulse`}>
              
              {/* Icon with reduced glow */}
              <Icon size={40} className="text-white drop-shadow-xl relative z-10 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              
              {/* Reduced shine effects */}
              <div className="absolute top-4 left-4 w-6 h-6 bg-white/40 rounded-full blur-sm"></div>
              <div className="absolute top-6 left-6 w-3 h-3 bg-white/20 rounded-full blur-xs"></div>
              
              {/* Reduced cosmic sparkles */}
              <div className="absolute top-2 right-2 w-1 h-1 bg-yellow-300/40 rounded-full animate-pulse"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-cyan-300/35 rounded-full animate-pulse" style={{animationDelay: '0.7s'}}></div>
            </div>
          </div>
          
          {/* Title with reduced effects */}
          <h3 className="text-white text-xl font-bold text-center mb-8 group-hover:text-gray-100 transition-colors font-sans tracking-wide 
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
            {subject.title}
          </h3>
        </div>
        
        {/* Start Learning Button with desaturated styling */}
        <button 
          onClick={handleClick}
          className={`w-full py-5 px-6 ${buttonGradient} text-white font-bold rounded-2xl transform transition-all duration-400 relative overflow-hidden group-hover:scale-105 border-3 border-white/20 text-lg
            shadow-[0_12px_30px_rgba(0,0,0,0.25),0_6px_15px_rgba(0,0,0,0.15),inset_0_3px_0_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.1)]
            hover:shadow-[0_20px_50px_rgba(147,51,234,0.25),0_10px_25px_rgba(59,130,246,0.15)]
            active:shadow-[0_6px_20px_rgba(0,0,0,0.25),0_3px_10px_rgba(0,0,0,0.15)]
            active:transform active:translateY-1
            before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:rounded-2xl before:pointer-events-none
            after:content-['✨'] after:absolute after:top-1/2 after:right-4 after:-translate-y-1/2 after:opacity-0 after:group-hover:opacity-100 after:transition-opacity after:duration-300`}
        >
          <span className="relative z-10 drop-shadow-lg">Start Learning!</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-500/10 to-pink-400/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-2xl"></div>
          
          {/* Reduced button shine effects */}
          <div className="absolute top-3 left-6 w-12 h-3 bg-white/30 rounded-full blur-sm"></div>
          <div className="absolute top-4 left-8 w-6 h-1.5 bg-white/15 rounded-full blur-xs"></div>
          
          {/* Reduced floating particles on button */}
          <div className="absolute top-2 right-8 w-0.5 h-0.5 bg-yellow-300/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-12 w-0.5 h-0.5 bg-cyan-300/25 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </button>

        {/* Subtle glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-black/5 rounded-3xl pointer-events-none"></div>
      </div>

      {/* Subtle shadow layer */}
      <div className="absolute inset-0 bg-black/20 rounded-3xl transform translate-y-2 -z-10 blur-sm"></div>
    </div>
  );
};

export default SubjectCard;
