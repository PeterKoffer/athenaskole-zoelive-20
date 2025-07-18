
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-white mb-4">
          Welcome to NELIE
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your AI-powered learning companion
        </p>
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-3 text-lg"
          >
            Get Started
          </Button>
          <Button 
            onClick={() => navigate('/daily-universe')}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg"
          >
            Explore Universe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
