
import React from 'react';
import { Calculator, BookOpen, Laptop, Zap, Palette, Music, Brain, Globe, Dumbbell, Target, Languages, Scroll } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Subject } from './SubjectsData';

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

// Desaturated 3D gradient backgrounds with transparency
const backgroundMap: Record<string, string> = {
  'Mathematics': 'bg-gradient-to-br from-orange-400/70 via-red-400/70 to-pink-400/70',
  'English Language Arts': 'bg-gradient-to-br from-blue-400/70 via-indigo-400/70 to-purple-400/70',
  'Science & Technology': 'bg-gradient-to-br from-green-400/70 via-emerald-400/70 to-teal-400/70',
  'Computer Science': 'bg-gradient-to-br from-yellow-400/70 via-amber-400/70 to-orange-400/70',
  'Creative Arts': 'bg-gradient-to-br from-pink-400/70 via-purple-400/70 to-violet-400/70',
  'Music Discovery': 'bg-gradient-to-br from-purple-400/70 via-violet-400/70 to-indigo-400/70',
  'Mental Wellness': 'bg-gradient-to-br from-green-400/70 via-teal-400/70 to-cyan-400/70',
  'Language Lab': 'bg-gradient-to-br from-blue-400/70 via-cyan-400/70 to-teal-400/70',
  'History & Religion': 'bg-gradient-to-br from-orange-400/70 via-red-400/70 to-pink-400/70',
  'Global Geography': 'bg-gradient-to-br from-cyan-400/70 via-blue-400/70 to-indigo-400/70',
  'BodyLab': 'bg-gradient-to-br from-red-400/70 via-pink-400/70 to-purple-400/70',
  'Life Essentials': 'bg-gradient-to-br from-purple-400/70 via-pink-400/70 to-red-400/70'
};

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, index, onStartLearning }) => {
  const Icon = iconMap[subject.title] || Calculator;
  const backgroundGradient = backgroundMap[subject.title] || 'bg-gradient-to-br from-blue-400/70 via-purple-400/70 to-pink-400/70';

  const handleClick = () => {
    console.log(`🎯 SubjectCard: Navigating to ${subject.path} for ${subject.title}`);
    onStartLearning(subject.path);
  };

  return (
    <div 
      className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 perspective-1000`}
      onClick={handleClick}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 3D Card Container */}
      <div className="relative preserve-3d transform-gpu transition-transform duration-500 group-hover:rotate-y-12 group-hover:rotate-x-6">
        {/* Main Card with transparency and backdrop blur */}
        <div className={`${backgroundGradient} rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-sm transform-gpu backface-hidden`}>
          {/* Floating Icon */}
          <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
            <div className="w-16 h-16 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Icon size={32} className="text-white" />
            </div>
          </div>
          
          {/* Title with 3D text effect */}
          <h3 className="text-white text-xl font-bold text-center mb-6 leading-tight drop-shadow-lg">
            {subject.title}
          </h3>
          
          {/* 3D Button with transparency */}
          <button className="w-full py-4 px-6 bg-white/25 backdrop-blur-sm text-white font-semibold rounded-2xl transition-all duration-300 hover:bg-white/35 hover:scale-105 shadow-lg border border-white/30">
            Start Learning
          </button>
        </div>

        {/* 3D Shadow/Depth Layer with reduced opacity */}
        <div className={`absolute inset-0 ${backgroundGradient} rounded-3xl opacity-30 transform translate-z-[-10px] scale-95 blur-sm`} />
      </div>

      {/* Floating particles effect with reduced opacity */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 right-4 w-2 h-2 bg-white/25 rounded-full animate-pulse" />
        <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-300" />
        <div className="absolute top-1/3 left-4 w-1.5 h-1.5 bg-white/15 rounded-full animate-pulse delay-700" />
      </div>
    </div>
  );
};

export default SubjectCard;
