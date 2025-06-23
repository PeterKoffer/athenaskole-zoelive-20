
import React from 'react';
import SubjectsSection from '../components/home/SubjectsSection';

const Index = () => {
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

      {/* Use SubjectsSection component */}
      <div className="relative z-10">
        <SubjectsSection />
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
