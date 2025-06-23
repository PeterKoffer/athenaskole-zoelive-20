
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useHomeNavbarLogic } from '@/hooks/useHomeNavbarLogic';
import HomeMainContent from '@/components/home/HomeMainContent';
import ProgressDashboard from '@/components/ProgressDashboard';
import GameHub from '@/components/GameHub';
import EnhancedAITutor from '@/components/EnhancedAITutor';
import AIInsightsDashboard from '@/components/ai-insights/AIInsightsDashboard';

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
    setActiveView,
    showInsightsDashboard,
    setShowInsightsDashboard
  } = useHomeNavbarLogic();

  const handleGetStarted = () => {
    console.log('🚀 Index: Get Started clicked, navigating to mathematics');
    // This will be handled by the navigation in HomeMainContent
  };

  // Show AI Insights Dashboard
  if (showInsightsDashboard) {
    return (
      <div className="min-h-screen bg-gray-900">
        <AIInsightsDashboard onBack={handleBackToHome} />
      </div>
    );
  }

  // Show Progress Dashboard
  if (state.showProgress) {
    return (
      <div className="min-h-screen bg-gray-900">
        <ProgressDashboard onBack={handleBackToHome} />
      </div>
    );
  }

  // Show Game Hub
  if (state.showGames) {
    return (
      <div className="min-h-screen bg-gray-900">
        <GameHub onBack={handleBackToHome} />
      </div>
    );
  }

  // Show AI Tutor
  if (state.showAITutor) {
    return (
      <div className="min-h-screen bg-gray-900">
        <EnhancedAITutor onBack={handleBackToHome} />
      </div>
    );
  }

  // Main homepage content
  return (
    <div className="min-h-screen bg-gray-900">
      <HomeMainContent user={user} onGetStarted={handleGetStarted} />
    </div>
  );
};

export default Index;
