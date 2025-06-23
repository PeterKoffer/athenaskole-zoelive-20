
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

// More saturated icon colors
const iconColorMap: Record<string, string> = {
  'Mathematics': 'bg-gradient-to-br from-orange-500 to-red-600',
  'English Language Arts': 'bg-gradient-to-br from-blue-500 to-indigo-600',
  'Science & Technology': 'bg-gradient-to-br from-green-500 to-emerald-600',
  'Computer Science': 'bg-gradient-to-br from-yellow-500 to-amber-600',
  'Creative Arts': 'bg-gradient-to-br from-pink-500 to-purple-600',
  'Music Discovery': 'bg-gradient-to-br from-purple-500 to-violet-600',
  'Mental Wellness': 'bg-gradient-to-br from-green-500 to-emerald-600',
  'Language Lab': 'bg-gradient-to-br from-blue-500 to-cyan-600',
  'History & Religion': 'bg-gradient-to-br from-orange-500 to-red-600',
  'Global Geography': 'bg-gradient-to-br from-blue-500 to-green-600',
  'BodyLab': 'bg-gradient-to-br from-red-500 to-orange-600',
  'Life Essentials': 'bg-gradient-to-br from-red-500 to-pink-600'
};

// More saturated button gradients
const buttonGradientMap: Record<string, string> = {
  'Mathematics': 'bg-gradient-to-r from-orange-500 to-red-600',
  'English Language Arts': 'bg-gradient-to-r from-blue-500 to-indigo-600',
  'Science & Technology': 'bg-gradient-to-r from-green-500 to-emerald-600',
  'Computer Science': 'bg-gradient-to-r from-yellow-500 to-amber-600',
  'Creative Arts': 'bg-gradient-to-r from-pink-500 to-purple-600',
  'Music Discovery': 'bg-gradient-to-r from-purple-500 to-violet-600',
  'Mental Wellness': 'bg-gradient-to-r from-green-500 to-teal-600',
  'Language Lab': 'bg-gradient-to-r from-blue-500 to-cyan-600',
  'History & Religion': 'bg-gradient-to-r from-orange-500 to-red-600',
  'Global Geography': 'bg-gradient-to-r from-cyan-500 to-blue-600',
  'BodyLab': 'bg-gradient-to-r from-red-500 to-pink-600',
  'Life Essentials': 'bg-gradient-to-r from-purple-500 to-pink-600'
};

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, index, onStartLearning }) => {
  const Icon = iconMap[subject.title] || Calculator;
  const iconColor = iconColorMap[subject.title] || 'bg-gradient-to-br from-blue-500 to-purple-600';
  const buttonGradient = buttonGradientMap[subject.title] || 'bg-gradient-to-r from-blue-500 to-purple-600';

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20">
      {/* Icon */}
      <div className="mb-6">
        <div className={`w-16 h-16 ${iconColor} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
          <Icon size={32} className="text-white" />
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-gray-800 text-xl font-bold text-center mb-6 leading-tight">
        {subject.title}
      </h3>
      
      {/* Button */}
      <button 
        onClick={() => onStartLearning(subject.path)}
        className={`w-full py-4 px-6 ${buttonGradient} text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
      >
        Start Learning
      </button>
    </div>
  );
};

export default SubjectCard;
