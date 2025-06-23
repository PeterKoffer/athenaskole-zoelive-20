
import { useAuth } from "@/hooks/useAuth";
import { useHomeNavbarLogic } from "@/hooks/useHomeNavbarLogic";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useLocation } from "react-router-dom";
import AuthModal from "@/components/AuthModal";
import ProgressDashboard from "@/components/ProgressDashboard";
import GameHub from "@/components/GameHub";
import EnhancedAITutor from "@/components/EnhancedAITutor";
import FloatingAITutor from "@/components/FloatingAITutor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeMainContent from "@/components/home/HomeMainContent";
import AIInsightsDashboard from "@/components/ai-insights/AIInsightsDashboard";
import InsightsNotification from "@/components/ai-insights/InsightsNotification";
import SubjectsSection from "@/components/home/SubjectsSection";

const userProgress = {
  matematik: 75,
  dansk: 60,
  engelsk: 80,
  naturteknik: 90
};

const Index = () => {
  const { user } = useAuth();
  const {
    handleShowProgress,
    handleShowGames,
    handleShowAITutor,
    handleShowInsights,
    handleBackToHome,
    state,
    resetState,
    showInsightsDashboard
  } = useHomeNavbarLogic();

  const {
    showAuthModal,
    handleGetStarted,
    handleModalClose,
    handleLogin
  } = useAuthModal(user);

  // Dashboard view sync effects
  const location = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useDashboardState here just to trigger the effects (scrollToTop/reset on mount)
  useDashboardState();

  const renderMainContent = () => {
    if (showInsightsDashboard) {
      return <AIInsightsDashboard onClose={handleBackToHome} />;
    }

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
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500">
        <HomeMainContent user={user} onGetStarted={handleGetStarted} />
        <SubjectsSection />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar 
        onGetStarted={handleGetStarted}
        onShowProgress={handleShowProgress}
        onShowGames={handleShowGames}
        onShowAITutor={handleShowAITutor}
        onShowInsights={handleShowInsights}
        onResetNavigation={resetState}
        showBackButton={state.showProgress || state.showGames || state.showAITutor || showInsightsDashboard}
        onBack={handleBackToHome}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderMainContent()}
      </main>

      <Footer />

      {/* Add Nelie - the floating AI tutor */}
      <FloatingAITutor />

      {user && !showInsightsDashboard && (
        <InsightsNotification onViewDashboard={handleShowInsights} />
      )}

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
