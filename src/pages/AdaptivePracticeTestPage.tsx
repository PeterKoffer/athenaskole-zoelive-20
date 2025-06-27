
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TestTube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdaptivePracticeModule from '@/components/adaptive-learning/AdaptivePracticeModule';
import contentAtomRepository from '@/services/content/contentRepository';
import type { ContentAtom } from '@/types/content';

const AdaptivePracticeTestPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  // Test ContentAtomRepository functionality
  useEffect(() => {
    const testContentAtomRepository = async () => {
      console.log('🧪 Testing ContentAtomRepository...');
      
      // Test with a sample KC ID - using a common math KC ID
      const testKcId = 'math-algebra-linear-equations';
      
      try {
        console.log(`📋 Fetching atoms for KC ID: ${testKcId}`);
        const atoms = await contentAtomRepository.getAtomsByKcId(testKcId);
        console.log(`✅ ContentAtomRepository test successful! Found ${atoms.length} atoms:`, atoms);
        
        // Log each atom for detailed inspection
        atoms.forEach((atom, index) => {
          console.log(`📝 Atom ${index + 1}:`, {
            atom_id: atom.atom_id,
            atom_type: atom.atom_type,
            kc_ids: atom.kc_ids,
            content_preview: typeof atom.content === 'object' ? 
              JSON.stringify(atom.content).substring(0, 100) + '...' : 
              atom.content?.toString().substring(0, 100) + '...'
          });
        });
      } catch (error) {
        console.error('❌ ContentAtomRepository test failed:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace'
        });
      }
    };

    testContentAtomRepository();
  }, []);

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
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700 mb-4">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> This is a development/testing page.
              </p>
            </div>
            <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
              <p className="text-green-300 text-sm">
                <strong>ContentAtomRepository Test:</strong> Check the browser console for test results.
                The test will attempt to fetch content atoms for KC ID 'math-algebra-linear-equations'.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Render Adaptive Practice Module */}
        <AdaptivePracticeModule />
        
      </div>
    </div>
  );
};

export default AdaptivePracticeTestPage;
