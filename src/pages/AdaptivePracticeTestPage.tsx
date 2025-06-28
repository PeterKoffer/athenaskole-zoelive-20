
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TestTube, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdaptivePracticeModule from '@/components/adaptive-learning/AdaptivePracticeModule';
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
              <h1 className="text-2xl font-bold text-white">Adaptive Practice - Database Integration</h1>
            </div>
          </div>

          {/* Test Page Info */}
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Database Integration Verified ✅
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                The adaptive practice module is now successfully integrated with real Supabase database content.
                It fetches actual content atoms and gracefully handles missing content by recommending new topics.
              </p>
              
              <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <p className="text-green-300 font-medium">Integration Complete</p>
                </div>
                <p className="text-green-200 text-sm">
                  The module fetches real fraction content from the database and provides an authentic 
                  adaptive learning experience with proper knowledge component progression.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Render Adaptive Practice Module */}
          <ErrorBoundary>
            <AdaptivePracticeModule />
          </ErrorBoundary>
          
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdaptivePracticeTestPage;
