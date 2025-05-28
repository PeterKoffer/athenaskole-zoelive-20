
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import ProgressDashboard from "@/components/ProgressDashboard";
import GameHub from "@/components/GameHub";
import EnhancedAITutor from "@/components/EnhancedAITutor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import SubjectsSection from "@/components/home/SubjectsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import Phase1FeaturesSection from "@/components/home/Phase1FeaturesSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  const { user } = useAuth();
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

  useEffect(() => {
    if (user) {
      console.log("User is logged in:", user);
    }
  }, [user]);

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleModalClose = () => {
    setShowAuthModal(false);
  };

  const handleLogin = () => {
    setShowAuthModal(false);
    // User state will be updated automatically by useAuth hook
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar 
        onGetStarted={handleGetStarted}
        onShowProgress={() => setShowProgress(true)}
        onShowGames={() => setShowGames(true)}
        onShowAITutor={() => setShowAITutor(true)}
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
            <Phase1FeaturesSection onShowAITutor={() => setShowAITutor(true)} />
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
