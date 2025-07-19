
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserMetadata } from "@/types/auth";
import { ArrowLeft, Clock, Star, Calculator, BookOpen, Beaker, Code, Palette, Music, Heart, Languages, Globe, Dumbbell, Home } from "lucide-react";
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import RefactoredFloatingAITutor from "@/components/floating-ai-tutor/RefactoredFloatingAITutor";

interface TodaysProgramActivity {
  id: string;
  title: string;
  type: string;
  description: string;
  duration: number;
  difficulty: 'Adaptive' | 'Beginner' | 'Intermediate' | 'Advanced';
  aiEnhanced: boolean;
  stars: number;
  maxStars: number;
  icon: any;
  gradient: string;
}

const todaysProgramActivities: TodaysProgramActivity[] = [
  {
    id: 'mathematics',
    title: 'Mathematics',
    type: 'Adaptive',
    description: 'Problem-solving and logical thinking with interactive exercises',
    duration: 20,
    difficulty: 'Adaptive',
    aiEnhanced: true,
    stars: 3,
    maxStars: 5,
    icon: Calculator,
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    id: 'english',
    title: 'English Language Arts',
    type: 'Adaptive',
    description: 'Reading comprehension and creative writing skills',
    duration: 25,
    difficulty: 'Adaptive',
    aiEnhanced: true,
    stars: 4,
    maxStars: 5,
    icon: BookOpen,
    gradient: 'from-green-500 to-teal-600'
  },
  {
    id: 'science',
    title: 'Science & Technology',
    type: 'Interactive',
    description: 'Explore scientific concepts through hands-on experiments',
    duration: 30,
    difficulty: 'Intermediate',
    aiEnhanced: true,
    stars: 2,
    maxStars: 5,
    icon: Beaker,
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: 'coding',
    title: 'Computer Science',
    type: 'Project-based',
    description: 'Learn programming fundamentals with fun coding challenges',
    duration: 35,
    difficulty: 'Beginner',
    aiEnhanced: true,
    stars: 1,
    maxStars: 5,
    icon: Code,
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'arts',
    title: 'Creative Arts',
    type: 'Creative',
    description: 'Express yourself through digital art and design projects',
    duration: 20,
    difficulty: 'Beginner',
    aiEnhanced: false,
    stars: 5,
    maxStars: 5,
    icon: Palette,
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    id: 'music',
    title: 'Music Discovery',
    type: 'Interactive',
    description: 'Learn about music theory and explore different instruments',
    duration: 15,
    difficulty: 'Beginner',
    aiEnhanced: true,
    stars: 3,
    maxStars: 5,
    icon: Music,
    gradient: 'from-indigo-500 to-blue-600'
  }
];

const TodaysProgram = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();
  
  console.log('📅 TodaysProgram component rendered:', {
    userExists: !!user,
    loading,
    activitiesCount: todaysProgramActivities?.length || 0,
    timestamp: new Date().toISOString()
  });
  
  const metadata = user?.user_metadata as UserMetadata | undefined;
  const firstName = metadata?.name?.split(' ')[0] || metadata?.first_name || 'Student';
  
  useEffect(() => {
    console.log('📅 TodaysProgram useEffect - scrolling to top');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartActivity = (activityId: string) => {
    console.log("🎯 Starting today's program activity:", activityId, "User:", user?.id);
    navigate(`/learn/${activityId}`);
  };

  const handleSpeakActivity = async (activity: TodaysProgramActivity) => {
    if (isSpeaking) {
      stop();
    } else {
      const text = `${activity.title}. ${activity.description}. Duration: ${activity.duration} minutes. Difficulty: ${activity.difficulty}.`;
      await speakAsNelie(text, true, `activity-${activity.id}`);
    }
  };

  const renderStars = (stars: number, maxStars: number) => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: maxStars }, (_, index) => (
          <Star 
            key={index} 
            className={`w-4 h-4 ${index < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
          />
        ))}
      </div>
    );
  };

  if (loading) {
    console.log('📅 TodaysProgram showing loading state');
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📅</div>
          <p className="text-lg">Loading today's program...</p>
        </div>
      </div>
    );
  }

  if (!todaysProgramActivities || todaysProgramActivities.length === 0) {
    console.error('❌ TodaysProgram: No activities available');
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-lg">No activities available for today. Please try again later.</p>
          <Button 
            onClick={() => navigate('/')} 
            className="bg-blue-600 hover:bg-blue-700 mt-4"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  console.log('📅 TodaysProgram rendering main content:', {
    userAuthenticated: !!user,
    firstName,
    activitiesCount: todaysProgramActivities.length
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <RefactoredFloatingAITutor />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-white hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Today's Program Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <h1 className="text-3xl font-bold text-white">Today's Program</h1>
          </div>
          {user && (
            <p className="text-blue-200 text-lg">
              Welcome back {firstName}! Here's your personalized learning program for today.
            </p>
          )}
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaysProgramActivities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <Card key={activity.id} className={`relative overflow-hidden bg-gradient-to-br ${activity.gradient} border-0 hover:scale-105 transition-transform duration-200`}>
                {/* Speaker Icon */}
                <button
                  onClick={() => handleSpeakActivity(activity)}
                  className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 shadow-lg backdrop-blur-sm"
                  title="Ask Nelie to read this activity"
                >
                  <CustomSpeakerIcon className="w-4 h-4" size={16} color="#ffffff" />
                </button>

                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {activity.type}
                      </span>
                      {activity.aiEnhanced && (
                        <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          🤖 AI Enhanced
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 pr-8">
                    {activity.title}
                  </h3>

                  <p className="text-white/90 text-sm mb-4 flex-grow">
                    {activity.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-white/80 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{activity.duration} min</span>
                      </div>
                      {renderStars(activity.stars, activity.maxStars)}
                    </div>

                    <Button 
                      onClick={() => handleStartActivity(activity.id)}
                      className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                      variant="outline"
                    >
                      Start Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        {!user && (
          <div className="mt-8 text-center">
            <div className="bg-blue-900/50 rounded-lg p-6 border border-blue-400/30">
              <p className="text-blue-200 mb-4">
                Sign in to track your progress and get personalized recommendations!
              </p>
              <Button 
                onClick={() => navigate('/auth')} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign In for Full Access
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysProgram;
