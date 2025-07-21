
import React from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import HomeMainContent from "@/components/home/HomeMainContent";
import RoleSwitcher from "@/components/RoleSwitcher";

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
      <HomeMainContent 
        user={user} 
        onGetStarted={handleGetStarted} 
      />
      {user && (
        <div className="fixed bottom-4 right-4 z-50">
          <RoleSwitcher />
        </div>
      )}
    </div>
  );
};

export default Index;
