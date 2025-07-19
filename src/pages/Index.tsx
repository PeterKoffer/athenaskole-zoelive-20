
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import HeroSection from '@/components/home/HeroSection';
import SubjectsSection from '@/components/home/SubjectsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/daily-program');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <HeroSection onGetStarted={handleGetStarted} />
      <SubjectsSection />
      <FeaturesSection />
      <div className="pb-20">
        <CTASection onGetStarted={handleGetStarted} />
      </div>
    </div>
  );
};

export default Index;
