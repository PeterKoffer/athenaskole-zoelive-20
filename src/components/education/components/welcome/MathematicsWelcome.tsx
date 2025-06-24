
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Play, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import TextWithSpeaker from '../shared/TextWithSpeaker';

interface MathematicsWelcomeProps {
  onStartLesson: () => void;
  studentName?: string;
}

const MathematicsWelcome = ({ onStartLesson, studentName = 'Student' }: MathematicsWelcomeProps) => {
  const navigate = useNavigate();
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const welcomeMessage = `Welcome to the exciting world of Mathematics, ${studentName}! Today we're going to explore numbers, patterns, and problem-solving in the most engaging way possible. Get ready to become a math detective as we discover how mathematics helps us understand the world around us!`;

  console.log('🧮 MathematicsWelcome rendering for:', studentName);

  const handleBackToHome = () => {
    console.log('🏠 Navigating back to home');
    navigate('/');
  };

  const handleStartLesson = () => {
    console.log('🚀 User clicked Start Math Adventure - calling onStartLesson');
    onStartLesson();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <TextWithSpeaker
        text={welcomeMessage}
        context="math-welcome"
        position="corner"
        showOnHover={false}
      >
        <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-purple-400">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4 animate-bounce">🧮</div>
              <Calculator className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Mathematics Adventure!</h1>
            <h2 className="text-xl text-purple-200 mb-8">Numbers, Patterns & Problem Solving</h2>
            
            <div className="text-xl text-purple-100 mb-8 leading-relaxed min-h-[10rem] flex items-center justify-center">
              <div className="max-w-3xl">
                <p className="animate-fade-in">{welcomeMessage}</p>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-lg p-6 mb-8">
              <h3 className="text-purple-200 font-bold text-lg mb-4">🔢 What You'll Discover Today:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-purple-100">
                <div>• Number patterns and sequences</div>
                <div>• Problem-solving strategies</div>
                <div>• Real-world math applications</div>
                <div>• Interactive math games</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleBackToHome}
                variant="outline"
                className="border-purple-400 text-purple-200 bg-purple-800/50 hover:bg-purple-700 transition-colors"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
              
              <Button
                onClick={handleStartLesson}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Math Adventure
              </Button>
            </div>
          </CardContent>
        </Card>
      </TextWithSpeaker>
    </div>
  );
};

export default MathematicsWelcome;
