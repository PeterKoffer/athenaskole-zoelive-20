
import React from 'react';
import SubjectCard from '../components/home/SubjectCard';
import { 
  Calculator, 
  BookOpen, 
  Laptop, 
  Zap, 
  Palette, 
  Music, 
  Brain, 
  Globe, 
  Dumbbell, 
  Target, 
  Languages,
  Scroll
} from 'lucide-react';

const Index = () => {
  const subjects = [
    {
      title: 'Mathematics',
      icon: Calculator,
      gradient: 'bg-gradient-to-br from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'bg-gradient-to-br from-orange-400 to-red-500'
    },
    {
      title: 'English Language Arts',
      icon: BookOpen,
      gradient: 'bg-gradient-to-br from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'bg-gradient-to-br from-blue-400 to-indigo-500'
    },
    {
      title: 'Science & Technology',
      icon: Laptop,
      gradient: 'bg-gradient-to-br from-teal-400 to-green-600',
      bgColor: 'bg-teal-50',
      iconColor: 'bg-gradient-to-br from-green-400 to-emerald-500'
    },
    {
      title: 'Computer Science',
      icon: Zap,
      gradient: 'bg-gradient-to-br from-yellow-400 to-orange-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'bg-gradient-to-br from-yellow-400 to-amber-500'
    },
    {
      title: 'Creative Arts',
      icon: Palette,
      gradient: 'bg-gradient-to-br from-pink-400 to-rose-500',
      bgColor: 'bg-pink-50',
      iconColor: 'bg-gradient-to-br from-pink-400 to-purple-500'
    },
    {
      title: 'Music Discovery',
      icon: Music,
      gradient: 'bg-gradient-to-br from-violet-400 to-purple-600',
      bgColor: 'bg-violet-50',
      iconColor: 'bg-gradient-to-br from-purple-400 to-violet-500'
    },
    {
      title: 'Mental Wellness',
      icon: Brain,
      gradient: 'bg-gradient-to-br from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-50',
      iconColor: 'bg-gradient-to-br from-green-400 to-emerald-500'
    },
    {
      title: 'Language Lab',
      icon: Languages,
      gradient: 'bg-gradient-to-br from-cyan-400 to-blue-500',  
      bgColor: 'bg-cyan-50',
      iconColor: 'bg-gradient-to-br from-blue-400 to-cyan-500'
    },
    {
      title: 'History & Religion',
      icon: Scroll,
      gradient: 'bg-gradient-to-br from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50',
      iconColor: 'bg-gradient-to-br from-orange-400 to-red-500'
    },
    {
      title: 'Global Geography',
      icon: Globe,
      gradient: 'bg-gradient-to-br from-sky-400 to-blue-500',
      bgColor: 'bg-sky-50',
      iconColor: 'bg-gradient-to-br from-blue-400 to-green-500'
    },
    {
      title: 'BodyLab',
      icon: Dumbbell,
      gradient: 'bg-gradient-to-br from-red-400 to-pink-500',
      bgColor: 'bg-red-50',
      iconColor: 'bg-gradient-to-br from-red-400 to-orange-500'
    },
    {
      title: 'Life Essentials',
      icon: Target,
      gradient: 'bg-gradient-to-br from-indigo-400 to-purple-500',
      bgColor: 'bg-indigo-50',
      iconColor: 'bg-gradient-to-br from-red-400 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 relative overflow-hidden">
      {/* Enhanced cosmic background with more universe elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-pink-300/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-300/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-purple-300/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      
      {/* Cosmic stars */}
      <div className="absolute top-10 left-1/2 w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
      <div className="absolute top-32 left-1/4 w-1 h-1 bg-cyan-300/80 rounded-full animate-pulse" style={{animationDelay: '0.7s'}}></div>
      <div className="absolute top-64 right-1/4 w-1.5 h-1.5 bg-yellow-300/70 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
      <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-pink-300/60 rounded-full animate-pulse" style={{animationDelay: '1.8s'}}></div>
      <div className="absolute bottom-64 right-1/2 w-2 h-2 bg-purple-300/50 rounded-full animate-pulse" style={{animationDelay: '2.3s'}}></div>

      {/* Header with cosmic styling */}
      <div className="max-w-7xl mx-auto mb-16 text-center relative z-10">
        <h1 className="text-6xl font-black text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text mb-6 drop-shadow-lg">
          🌌 Learning Universe ✨
        </h1>
        <p className="text-2xl text-cyan-100 max-w-3xl mx-auto font-semibold leading-relaxed drop-shadow-sm">
          Explore our cosmic collection of interactive courses in this magical learning universe! 🚀
        </p>
      </div>

      {/* Subject Grid with enhanced material depth */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {subjects.map((subject, index) => (
            <SubjectCard
              key={index}
              title={subject.title}
              icon={subject.icon}
              gradient={subject.gradient}
              bgColor={subject.bgColor}
              iconColor={subject.iconColor}
            />
          ))}
        </div>
      </div>

      {/* Footer with cosmic styling */}
      <div className="max-w-7xl mx-auto mt-20 text-center relative z-10">
        <p className="text-cyan-200 text-lg font-medium">
          🌟 Launch your cosmic learning adventure today! 🛸
        </p>
      </div>
    </div>
  );
};

export default Index;
