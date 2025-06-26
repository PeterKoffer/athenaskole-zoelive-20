// src/pages/AdaptivePracticeTestPage.tsx
import React from 'react'; // Make sure React is imported
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TestTube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Path to the module we created in src/components/adaptive-learning/
// Adjust this path if your alias or actual file location is different.
// If src/pages/ and src/components/ are siblings, this should be correct:
import AdaptivePracticeModule from '../components/adaptive-learning/AdaptivePracticeModule';

const AdaptivePracticeTestPage: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
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
            <h1 className="text-2xl font-bold text-white">Test Environment</h1>
          </div>
        </div>

        {/* Test Page Info */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TestTube className="w-5 h-5 mr-2 text-blue-400" />
              Adaptive Practice Module Test Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              This page is for testing the end-to-end flow of the adaptive practice module.
              Use this environment to verify all functionality works as expected.
            </p>
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> This is a development/testing page.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Render Adaptive Practice Module HERE instead of the placeholder */}
        <AdaptivePracticeModule />
        
      </div>
    </div>
  );
};

export default AdaptivePracticeTestPage;
