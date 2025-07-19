
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserMetadata } from "@/types/auth";
import { ArrowLeft, Target, Dumbbell } from "lucide-react";
import TodaysProgramGrid from "@/components/daily-program/TodaysProgramGrid";
import { dailyActivities } from "@/components/daily-program/dailyActivitiesData";

const TrainingGround = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  
  console.log('🏋️ TrainingGround component rendered:', {
    userExists: !!user,
    loading,
    activitiesCount: dailyActivities?.length || 0,
    timestamp: new Date().toISOString()
  });
  
  const metadata = user?.user_metadata as UserMetadata | undefined;
  const firstName = metadata?.name?.split(' ')[0] || metadata?.first_name || 'Student';
  
  // Scroll to top when page loads
  useEffect(() => {
    console.log('🏋️ TrainingGround useEffect - scrolling to top');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartActivity = (activityId: string) => {
    console.log("🎯 Starting focused training activity:", activityId, "User:", user?.id);
    
    setSelectedActivity(activityId);
    console.log("🚀 Navigating to AI-generated content for:", `/learn/${activityId}`);
    
    // Navigate to AI-generated educational content for the specific subject
    navigate(`/learn/${activityId}`);
  };

  // Show loading state while authentication is being checked
  if (loading) {
    console.log('🏋️ TrainingGround showing loading state');
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏋️</div>
          <p className="text-lg">Loading your training ground...</p>
        </div>
      </div>
    );
  }

  // Check if activities are available
  if (!dailyActivities || dailyActivities.length === 0) {
    console.error('❌ TrainingGround: No training activities available');
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-lg">No training activities available. Please try again later.</p>
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

  console.log('🏋️ TrainingGround rendering main content:', {
    userAuthenticated: !!user,
    firstName,
    activitiesCount: dailyActivities.length
  });

  // Main content for authenticated users
  if (user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-4xl mx-auto">
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

          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-400 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Dumbbell className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Training Ground</h1>
                <p className="text-blue-200 font-medium">
                  Welcome {firstName}! Choose a subject for focused AI-powered training
                </p>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2 text-white">
                <Target className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold">Focused Learning:</span>
                <span>Deep dive into specific subjects with personalized AI content</span>
              </div>
            </div>
          </div>

          {/* Training Activities Grid - removed the Today's Program heading */}
          <TodaysProgramGrid activities={dailyActivities} onStartActivity={handleStartActivity} />
        </div>
      </div>
    );
  }

  // Content for non-authenticated users
  console.log('🏋️ TrainingGround rendering guest content');
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🏋️</div>
          <h1 className="text-3xl font-bold mb-4">Training Ground</h1>
          <p className="text-gray-300 mb-6">
            You can explore the training activities below. For a personalized experience, please sign in.
          </p>
          <Button 
            onClick={() => navigate('/auth')} 
            className="bg-blue-600 hover:bg-blue-700 mb-8"
          >
            Sign In for Full Access
          </Button>
        </div>
        
        <TodaysProgramGrid activities={dailyActivities} onStartActivity={handleStartActivity} />
        
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate('/')} className="border-gray-600 text-slate-950 bg-sky-50">
            Back to home page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrainingGround;
