
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "@/hooks/useNavigation";
import { useNavbarState } from "@/hooks/useNavbarState";
import { useLocation } from "react-router-dom";
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
  const { navigateToHome, scrollToTop } = useNavigation();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { state, resetState, setActiveView } = useNavbarState();

  const userProgress = {
    matematik: 75,
    dansk: 60,
    engelsk: 80,
    naturteknik: 90
  };

  // Scroll to top when page loads or navigation state changes
  useEffect(() => {
    scrollToTop();
  }, [location.pathname, state.showProgress, state.showGames, state.showAITutor, scrollToTop]);

  // Additional scroll to top specifically for AI tutor
  useEffect(() => {
    if (state.showAITutor) {
      // Use setTimeout to ensure the component has rendered
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [state.showAITutor]);

  useEffect(() => {
    if (user) {
      console.log("User is logged in:", user);
    }
  }, [user]);

  const handleGetStarted = () => {
    console.log("Get Started button clicked, user:", user);
    if (user) {
      console.log("User is logged in, starting AI tutor experience");
      setActiveView('showAITutor');
      scrollToTop();
    } else {
      console.log("User not logged in, showing auth modal");
      setShowAuthModal(true);
    }
  };

  const handleModalClose = () => {
    console.log("Auth modal closing");
    setShowAuthModal(false);
  };

  const handleLogin = () => {
    console.log("Login successful, closing modal");
    setShowAuthModal(false);
  };

  const handleShowProgress = () => {
    setActiveView('showProgress');
    scrollToTop();
  };

  const handleShowGames = () => {
    setActiveView('showGames');
    scrollToTop();
  };

  const handleShowAITutor = () => {
    setActiveView('showAITutor');
    scrollToTop();
  };

  const handleBackToHome = () => {
    resetState();
    scrollToTop();
  };

  const renderMainContent = () => {
    if (state.showProgress && user) {
      return (
        <div className="py-8">
          <ProgressDashboard userProgress={userProgress} />
        </div>
      );
    }

    if (state.showGames) {
      return (
        <div className="py-8">
          <GameHub />
        </div>
      );
    }

    if (state.showAITutor) {
      return (
        <div className="py-8">
          <EnhancedAITutor user={user} onBack={handleBackToHome} />
        </div>
      );
    }

    return (
      <>
        <HeroSection onGetStarted={handleGetStarted} />
        <SubjectsSection />
        <FeaturesSection />
        <div className="pb-20">
          <CTASection onGetStarted={handleGetStarted} />
        </div>
      </>
    );
  };

  console.log("Index component rendering, showAuthModal:", showAuthModal);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar 
        onGetStarted={handleGetStarted}
        onShowProgress={handleShowProgress}
        onShowGames={handleShowGames}
        onShowAITutor={handleShowAITutor}
        onResetNavigation={resetState}
        showBackButton={state.showProgress || state.showGames || state.showAITutor}
        onBack={handleBackToHome}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderMainContent()}
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
