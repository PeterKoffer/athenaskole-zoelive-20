
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import AuthModal from "@/components/AuthModal";
import ProgressDashboard from "@/components/ProgressDashboard";
import GameHub from "@/components/GameHub";
import EnhancedAITutor from "@/components/EnhancedAITutor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import SubjectsSection from "@/components/home/SubjectsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [showAITutor, setShowAITutor] = useState(false);

  const userProgress = {
    matematik: 75,
    dansk: 60,
    engelsk: 80,
    naturteknik: 90
  };

  // Scroll to top when page loads or navigation state changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, showProgress, showGames, showAITutor]);

  useEffect(() => {
    if (user) {
      console.log("User is logged in:", user);
    }
  }, [user]);

  const resetNavigationState = () => {
    setShowProgress(false);
    setShowGames(false);
    setShowAITutor(false);
  };

  const handleGetStarted = () => {
    if (user) {
      // If user is logged in, go directly to daily program
      navigate('/daily-program');
    } else {
      // If not logged in, show auth modal
      setShowAuthModal(true);
    }
  };

  const handleModalClose = () => {
    setShowAuthModal(false);
  };

  const handleLogin = () => {
    setShowAuthModal(false);
    // After login, stay on homepage instead of navigating to daily program
  };

  const handleShowProgress = () => {
    setShowProgress(true);
    setShowGames(false);
    setShowAITutor(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowGames = () => {
    setShowGames(true);
    setShowProgress(false);
    setShowAITutor(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowAITutor = () => {
    setShowAITutor(true);
    setShowProgress(false);
    setShowGames(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar 
        onGetStarted={handleGetStarted}
        onShowProgress={handleShowProgress}
        onShowGames={handleShowGames}
        onShowAITutor={handleShowAITutor}
        onResetNavigation={resetNavigationState}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showProgress && user ? (
          <div className="py-8">
            <ProgressDashboard userProgress={userProgress} />
          </div>
        ) : showGames ? (
          <div className="py-8">
            <GameHub />
          </div>
        ) : showAITutor ? (
          <div className="py-8">
            <EnhancedAITutor user={user} />
          </div>
        ) : (
          <>
            <HeroSection onGetStarted={handleGetStarted} />
            <SubjectsSection />
            <FeaturesSection />
            <CTASection onGetStarted={handleGetStarted} />
          </>
        )}
      </main>

      <Footer />

      {showAuthModal && (
        <AuthModal 
          onClose={handleModalClose} 
          onLogin={handleLogin} 
        />
      )}
    </div>
  );
};

export default Index;
