
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdaptivePracticeModule from '@/components/adaptive-learning/AdaptivePracticeModule';
import { contentRepository } from '@/services/content/contentRepository';

const AdaptivePracticeTestPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  // Test ContentAtomRepository functionality
  useEffect(() => {
    const testContentAtomRepository = async () => {
      console.log('🧪 Testing ContentAtomRepository...');
      
      // Test with the KC IDs we just inserted
      const testKcIds = [
        'kc_math_g4_add_fractions_likedenom',
        'kc_math_g4_subtract_fractions_likedenom'
      ];
      
      for (const kcId of testKcIds) {
        try {
          console.log(`📋 Fetching atoms for KC ID: ${kcId}`);
          const atoms = await contentRepository.getAtomsByKcId(kcId);
          console.log(`✅ ContentAtomRepository test successful for ${kcId}! Found ${atoms.length} atoms:`, atoms);
          
          // Log each atom for detailed inspection
          atoms.forEach((atom, index) => {
            console.log(`📝 Atom ${index + 1} for ${kcId}:`, {
              atom_id: atom.atom_id,
              atom_type: atom.atom_type,
              kc_ids: atom.kc_ids,
              content_preview: typeof atom.content === 'object' ? 
                JSON.stringify(atom.content).substring(0, 100) + '...' : 
                atom.content?.toString().substring(0, 100) + '...'
            });
          });
        } catch (error) {
          console.error(`❌ ContentAtomRepository test failed for ${kcId}:`, error);
        }
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
            <h1 className="text-2xl font-bold text-white">Content Atoms Test Environment</h1>
          </div>
        </div>

        {/* Test Page Info */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TestTube className="w-5 h-5 mr-2 text-blue-400" />
              Adaptive Practice Module Test - With Real Database Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              This page tests the end-to-end flow of the adaptive practice module with real content atoms 
              from the Supabase database. The module should now fetch actual content instead of mock data.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <p className="text-green-300 font-medium">Database Content</p>
                </div>
                <p className="text-green-200 text-sm">
                  Sample content atoms for fractions have been added to the database.
                </p>
              </div>
              
              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
                <div className="flex items-center mb-2">
                  <TestTube className="w-5 h-5 text-blue-400 mr-2" />
                  <p className="text-blue-300 font-medium">Testing Process</p>
                </div>
                <p className="text-blue-200 text-sm">
                  Check the browser console for detailed test results and content fetching logs.
                </p>
              </div>
            </div>

            <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-700">
              <p className="text-yellow-300 text-sm">
                <strong>Expected Behavior:</strong> The module should now display real content atoms for 
                "Adding Fractions with Like Denominators" including explanations and practice questions.
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
