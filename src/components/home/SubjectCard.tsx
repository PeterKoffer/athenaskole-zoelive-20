
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

// 3D gradient backgrounds
const backgroundMap: Record<string, string> = {
  'Mathematics': 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500',
  'English Language Arts': 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500',
  'Science & Technology': 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500',
  'Computer Science': 'bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500',
  'Creative Arts': 'bg-gradient-to-br from-pink-500 via-purple-500 to-violet-500',
  'Music Discovery': 'bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500',
  'Mental Wellness': 'bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500',
  'Language Lab': 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500',
  'History & Religion': 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500',
  'Global Geography': 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500',
  'BodyLab': 'bg-gradient-to-br from-red-500 via-pink-500 to-purple-500',
  'Life Essentials': 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500'
};

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, index, onStartLearning }) => {
  const Icon = iconMap[subject.title] || Calculator;
  const backgroundGradient = backgroundMap[subject.title] || 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500';

  return (
    <div 
      className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 perspective-1000`}
      onClick={() => onStartLearning(subject.path)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 3D Card Container */}
      <div className="relative preserve-3d transform-gpu transition-transform duration-500 group-hover:rotate-y-12 group-hover:rotate-x-6">
        {/* Main Card */}
        <div className={`${backgroundGradient} rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-sm transform-gpu backface-hidden`}>
          {/* Floating Icon */}
          <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Icon size={32} className="text-white" />
            </div>
          </div>
          
          {/* Title with 3D text effect */}
          <h3 className="text-white text-xl font-bold text-center mb-6 leading-tight drop-shadow-lg">
            {subject.title}
          </h3>
          
          {/* 3D Button */}
          <button className="w-full py-4 px-6 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-2xl transition-all duration-300 hover:bg-white/30 hover:scale-105 shadow-lg border border-white/30">
            Start Learning
          </button>
        </div>

        {/* 3D Shadow/Depth Layer */}
        <div className={`absolute inset-0 ${backgroundGradient} rounded-3xl opacity-50 transform translate-z-[-10px] scale-95 blur-sm`} />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
        <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-300" />
        <div className="absolute top-1/3 left-4 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-700" />
      </div>
    </div>
  );
};

export default SubjectCard;
