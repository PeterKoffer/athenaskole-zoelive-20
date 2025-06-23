
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

// iOS-style gradient backgrounds matching the reference
const backgroundMap: Record<string, string> = {
  'Mathematics': 'bg-gradient-to-br from-orange-300 via-orange-400 to-red-400',
  'English Language Arts': 'bg-gradient-to-br from-blue-300 via-blue-400 to-purple-400',
  'Science & Technology': 'bg-gradient-to-br from-green-300 via-emerald-400 to-teal-400',
  'Computer Science': 'bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400',
  'Creative Arts': 'bg-gradient-to-br from-pink-300 via-purple-400 to-violet-400',
  'Music Discovery': 'bg-gradient-to-br from-purple-300 via-violet-400 to-indigo-400',
  'Mental Wellness': 'bg-gradient-to-br from-green-300 via-teal-400 to-cyan-400',
  'Language Lab': 'bg-gradient-to-br from-blue-300 via-cyan-400 to-teal-400',
  'History & Religion': 'bg-gradient-to-br from-orange-300 via-red-400 to-pink-400',
  'Global Geography': 'bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-400',
  'BodyLab': 'bg-gradient-to-br from-red-300 via-pink-400 to-purple-400',
  'Life Essentials': 'bg-gradient-to-br from-purple-300 via-pink-400 to-red-400'
};

// Card background gradients to match iOS style
const cardBackgroundMap: Record<string, string> = {
  'Mathematics': 'bg-gradient-to-br from-blue-100/80 via-purple-50/60 to-pink-100/80',
  'English Language Arts': 'bg-gradient-to-br from-purple-100/80 via-pink-50/60 to-blue-100/80',
  'Science & Technology': 'bg-gradient-to-br from-green-100/80 via-cyan-50/60 to-teal-100/80',
  'Computer Science': 'bg-gradient-to-br from-yellow-100/80 via-orange-50/60 to-amber-100/80',
  'Creative Arts': 'bg-gradient-to-br from-pink-100/80 via-purple-50/60 to-violet-100/80',
  'Music Discovery': 'bg-gradient-to-br from-purple-100/80 via-indigo-50/60 to-blue-100/80',
  'Mental Wellness': 'bg-gradient-to-br from-green-100/80 via-teal-50/60 to-cyan-100/80',
  'Language Lab': 'bg-gradient-to-br from-blue-100/80 via-cyan-50/60 to-teal-100/80',
  'History & Religion': 'bg-gradient-to-br from-orange-100/80 via-red-50/60 to-pink-100/80',
  'Global Geography': 'bg-gradient-to-br from-cyan-100/80 via-blue-50/60 to-indigo-100/80',
  'BodyLab': 'bg-gradient-to-br from-red-100/80 via-pink-50/60 to-purple-100/80',
  'Life Essentials': 'bg-gradient-to-br from-purple-100/80 via-pink-50/60 to-red-100/80'
};

const buttonGradientMap: Record<string, string> = {
  'Mathematics': 'bg-gradient-to-r from-blue-400 to-blue-500',
  'English Language Arts': 'bg-gradient-to-r from-purple-400 to-purple-500',
  'Science & Technology': 'bg-gradient-to-r from-green-400 to-green-500',
  'Computer Science': 'bg-gradient-to-r from-orange-400 to-orange-500',
  'Creative Arts': 'bg-gradient-to-r from-pink-400 to-pink-500',
  'Music Discovery': 'bg-gradient-to-r from-purple-400 to-purple-500',
  'Mental Wellness': 'bg-gradient-to-r from-green-400 to-green-500',
  'Language Lab': 'bg-gradient-to-r from-blue-400 to-blue-500',
  'History & Religion': 'bg-gradient-to-r from-orange-400 to-orange-500',
  'Global Geography': 'bg-gradient-to-r from-cyan-400 to-cyan-500',
  'BodyLab': 'bg-gradient-to-r from-red-400 to-red-500',
  'Life Essentials': 'bg-gradient-to-r from-purple-400 to-purple-500'
};

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, index, onStartLearning }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { speakAsNelie } = useUnifiedSpeech();
  
  const Icon = iconMap[subject.title] || Calculator;
  const iconGradient = backgroundMap[subject.title] || 'bg-gradient-to-br from-blue-400 to-purple-400';
  const cardBackground = cardBackgroundMap[subject.title] || 'bg-gradient-to-br from-blue-100/80 to-purple-100/80';
  const buttonGradient = buttonGradientMap[subject.title] || 'bg-gradient-to-r from-blue-400 to-blue-500';

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
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Main Card */}
      <div className={`relative ${cardBackground} rounded-3xl p-6 shadow-xl border border-white/30 backdrop-blur-sm overflow-hidden`}>

        {/* Speaker Icon */}
        <button
          onClick={handleSpeakerClick}
          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
          title="Ask Nelie to explain this subject"
        >
          <Volume2 size={16} className="text-white" />
        </button>

        {/* Dropdown Menu */}
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button
              onClick={handleDropdownClick}
              className="absolute top-4 right-16 p-2 bg-purple-500/80 hover:bg-purple-600/80 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
              title="More information"
            >
              <ChevronDown size={16} className="text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-white/95 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl">
            <DropdownMenuItem className="p-4 cursor-default">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">{subject.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{subject.description}</p>
                {subject.keyAreas && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Key Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {subject.keyAreas.slice(0, 3).map((area, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
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

        {/* Icon Container */}
        <div className="flex justify-center mb-6 mt-8">
          <div className={`w-20 h-20 ${iconGradient} rounded-3xl flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110`}>
            <Icon size={32} className="text-white drop-shadow-lg" />
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-gray-800 text-xl font-bold text-center mb-6 leading-tight">
          {subject.title}
        </h3>
        
        {/* Button */}
        <button 
          onClick={handleClick}
          className={`w-full py-4 px-6 ${buttonGradient} text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md`}
        >
          Start Learning!
        </button>

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 rounded-3xl pointer-events-none"></div>
      </div>

      {/* Subtle shadow layer */}
      <div className="absolute inset-0 bg-black/5 rounded-3xl transform translate-y-2 -z-10 blur-sm"></div>
    </div>
  );
};

export default SubjectCard;
