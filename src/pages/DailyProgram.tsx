
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserMetadata } from "@/types/auth";
import WelcomeCard from "@/components/daily-program/WelcomeCard";
import TodaysProgramGrid from "@/components/daily-program/TodaysProgramGrid";
import NeliesTips from "@/components/daily-program/NeliesTips";
import DailyUniverseCard from "@/components/daily-program/DailyUniverseCard";
import { dailyActivities } from "@/components/daily-program/dailyActivitiesData";

const DailyProgram = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  
  const metadata = user?.user_metadata as UserMetadata | undefined;
  const firstName = metadata?.name?.split(' ')[0] || metadata?.first_name || 'Student';
  
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Don't redirect immediately - allow some time for auth to settle
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    
    if (!loading && !user) {
      console.log("User not authenticated, will redirect to auth in 2 seconds");
      redirectTimer = setTimeout(() => {
        navigate('/auth');
      }, 2000);
    }

    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [user, loading, navigate]);
  
  // Force English locale for date formatting
  const todaysDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleStartActivity = (activityId: string) => {
    console.log("Starting activity:", activityId, "User:", user?.id);
    
    setSelectedActivity(activityId);
    console.log("Navigating to:", `/learn/${activityId}`);
    
    // Navigate to the specific educational component
    navigate(`/learn/${activityId}`);
  };

  const handleStartUniverse = () => {
    console.log("Starting Daily Universe for user:", user?.id);
    navigate('/daily-universe');
  };

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎓</div>
          <p className="text-lg">Loading your daily program...</p>
        </div>
      </div>
    );
  }

  // Show temporary message if user is not authenticated but allow access
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🎓</div>
            <h1 className="text-3xl font-bold mb-4">Welcome to Daily Program</h1>
            <p className="text-gray-300 mb-6">
              You can explore the learning activities below. For a personalized experience, please sign in.
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
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <WelcomeCard 
          firstName={firstName} 
          todaysDate={todaysDate} 
          activityCount={dailyActivities.length}
        />
        
        {/* Featured Daily Universe */}
        <div className="mb-8">
          <DailyUniverseCard onStartUniverse={handleStartUniverse} />
        </div>

        {/* Alternative Individual Activities */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">
            Or choose individual subject practice:
          </h2>
          <TodaysProgramGrid activities={dailyActivities} onStartActivity={handleStartActivity} />
        </div>
        
        <NeliesTips />

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate('/')} className="border-gray-600 text-slate-950 bg-sky-50">
            Back to home page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DailyProgram;
