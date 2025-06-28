
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TestTube, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdaptivePracticeModule from '@/components/adaptive-learning/AdaptivePracticeModule';
import FloatingAITutor from '@/components/FloatingAITutor';
import ErrorBoundary from '@/components/ErrorBoundary';

const AdaptivePracticeTestPage: React.FC = () => {
  const navigate = useNavigate();
  
  console.log('🧪 AdaptivePracticeTestPage rendering...');
  
  const handleBack = () => {
    console.log('⬅️ Navigating back...');
    navigate(-1);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button onClick={handleBack} variant="outline" className="border-gray-600 text-slate-950 bg-zinc-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center space-x-2">
              <TestTube className="w-6 h-6 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Adaptive Practice - Mathematics</h1>
            </div>
          </div>

          {/* Render Adaptive Practice Module */}
          <ErrorBoundary>
            <AdaptivePracticeModule />
          </ErrorBoundary>
          
        </div>
        
        {/* Add Nelie - Floating AI Tutor */}
        <FloatingAITutor />
      </div>
    </ErrorBoundary>
  );
};

export default AdaptivePracticeTestPage;
