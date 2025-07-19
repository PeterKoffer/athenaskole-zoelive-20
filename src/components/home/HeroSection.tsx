
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserMetadata } from '@/types/auth';
import { Target, BookOpen, Dumbbell, Sparkles } from 'lucide-react';
import SubjectsSection from './SubjectsSection';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showNelie, setShowNelie] = useState(false);

  const metadata = user?.user_metadata as UserMetadata | undefined;
  const firstName = metadata?.name?.split(' ')[0] || metadata?.first_name || 'Student';

  useEffect(() => {
    const timer = setTimeout(() => setShowNelie(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDailyProgram = () => {
    console.log('🎯 Navigating to Daily Program');
    navigate('/daily-program');
  };

  const handleTrainingGround = () => {
    console.log('🏋️ Navigating to Training Ground');
    navigate('/training-ground');
  };

  const handleAuth = () => {
    console.log('🔐 Navigating to Auth');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -left-40 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Nelie AI Learning
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {!user ? (
                <Button
                  onClick={handleAuth}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                >
                  Sign In
                </Button>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-cyan-300">Welcome, {firstName}!</span>
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="outline"
                    className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900"
                  >
                    Profile
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </header>

        {/* Main Hero Content */}
        <main className="px-6 pt-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="mb-8"
              >
                <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                  Learn with AI
                </h2>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Experience personalized learning powered by artificial intelligence. 
                  Your AI tutor Nelie adapts to your pace and learning style.
                </p>
              </motion.div>

              {/* Nelie Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: showNelie ? 1 : 0, 
                  scale: showNelie ? 1 : 0.5,
                  rotate: showNelie ? [0, 5, -5, 0] : 0
                }}
                transition={{ 
                  duration: 0.8,
                  rotate: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                }}
                className="mb-12"
              >
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-6xl relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full animate-ping" />
                  <span className="relative z-10">🤖</span>
                </div>
                <p className="mt-4 text-cyan-300 font-semibold text-lg">
                  Hi! I'm Nelie, your AI learning companion
                </p>
              </motion.div>

              {/* Main Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              >
                <Button
                  onClick={handleDailyProgram}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 w-full sm:w-auto"
                >
                  <Target className="w-6 h-6 mr-3" />
                  Today's Program
                </Button>

                <Button
                  onClick={handleTrainingGround}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 w-full sm:w-auto"
                >
                  <Dumbbell className="w-6 h-6 mr-3" />
                  Training Ground
                </Button>

                {!user && (
                  <Button
                    onClick={handleAuth}
                    size="lg"
                    variant="outline"
                    className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 w-full sm:w-auto"
                  >
                    <BookOpen className="w-6 h-6 mr-3" />
                    Get Started
                  </Button>
                )}
              </motion.div>

              {/* Description Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16"
              >
                <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
                  <Target className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Today's Program</h3>
                  <p className="text-gray-300">
                    AI-generated daily lessons and immersive learning universes tailored to your progress and curriculum requirements.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
                  <Dumbbell className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Training Ground</h3>
                  <p className="text-gray-300">
                    Focused subject-specific training with AI-generated content that adapts to your learning style and curriculum standards.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        {/* Subjects Preview Section - Only show preview, not full functionality */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="px-6 pb-12"
        >
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Available Subjects in Training Ground
            </h3>
            <p className="text-gray-300 mb-8">
              Click "Training Ground" above to access focused AI-powered learning in these subjects
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {['Mathematics', 'English', 'Science', 'Music', 'Creative Arts', 'Body Lab', 'Computer Science', 'Mental Wellness'].map((subject, index) => (
                <div
                  key={subject}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-600/30 rounded-lg p-3 text-center opacity-80"
                >
                  <p className="text-sm text-gray-300">{subject}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
