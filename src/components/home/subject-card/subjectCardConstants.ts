
import { Calculator, BookOpen, Laptop, Zap, Palette, Music, Brain, Globe, Dumbbell, Target, Languages, Scroll } from 'lucide-react';
import { IconMapping, GradientMapping } from './types';

// Map subject titles to icons
export const iconMap: IconMapping = {
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

// Smaller desaturated iOS-style gradient backgrounds for icons
export const iconGradientMap: GradientMapping = {
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

// Button gradients
export const buttonGradientMap: GradientMapping = {
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
