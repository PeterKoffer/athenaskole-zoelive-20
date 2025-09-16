
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TestTube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocalizationTestPanel from '@/components/testing/LocalizationTestPanel';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const LocalizationTestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="border-gray-600 text-slate-950 bg-zinc-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <div className="flex items-center space-x-2">
              <TestTube className="w-6 h-6 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Localization Testing</h1>
            </div>
          </div>
        </div>

        {/* Test Info */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TestTube className="w-5 h-5 mr-2 text-blue-400" />
              Phase 1.X & 2.A Localization Testing Suite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              This page helps you test the end-to-end localization flow that was implemented in 
              Phase 1.X (Localization Foundations) and Phase 2.A (Pilot Math Content with Localization).
            </p>
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
              <p className="text-blue-300 text-sm">
                <strong>What gets tested:</strong> Database setup, knowledge components, 
                curriculum standards, content atoms, language switching, and Supabase logging.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Panel */}
        <LocalizationTestPanel />
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Quick Links for Testing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={() => navigate('/adaptive-practice-test')} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Test Adaptive Practice Module
              </Button>
              <Button 
                onClick={() => navigate('/education/math')} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Test Math Learning Content
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Test Daily Program
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Expected Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>✅ Content loads in selected language</li>
                <li>✅ KC names switch with language</li>
                <li>✅ Curriculum context updates</li>
                <li>✅ Events logged to Supabase</li>
                <li>✅ No console errors</li>
                <li>✅ Smooth language transitions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LocalizationTestPage;
