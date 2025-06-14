
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import WelcomeCard from "@/components/daily-program/WelcomeCard";
import TodaysProgramGrid from "@/components/daily-program/TodaysProgramGrid";
import NeliesTips from "@/components/daily-program/NeliesTips";
import { dailyActivities } from "@/components/daily-program/dailyActivitiesData";

const DailyProgram = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  
  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'Student';
  
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Redirect to auth if not logged in - but only after loading is complete
  useEffect(() => {
    if (!loading && !user) {
      console.log("User not authenticated, redirecting to auth");
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  
  const todaysDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleStartActivity = (activityId: string) => {
    console.log("Starting activity:", activityId, "User:", user);
    
    if (!user) {
      console.log("No user found, redirecting to auth");
      navigate('/auth');
      return;
    }

    setSelectedActivity(activityId);
    console.log("Navigating to:", `/learn/${activityId}`);
    
    // Navigate to the specific educational component
    navigate(`/learn/${activityId}`);
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

  // Don't render the component if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <WelcomeCard 
          firstName={firstName} 
          todaysDate={todaysDate} 
          activityCount={dailyActivities.length}
        />
        <TodaysProgramGrid activities={dailyActivities} onStartActivity={handleStartActivity} />
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
