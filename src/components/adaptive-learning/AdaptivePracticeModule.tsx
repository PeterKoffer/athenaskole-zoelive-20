
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AdaptivePracticeModuleProps {
  onBack: () => void;
}

const AdaptivePracticeModule = ({ onBack }: AdaptivePracticeModuleProps) => {
  console.log('🔍 SIMPLIFIED AdaptivePracticeModule rendering - basic test');

  // Simple useEffect to test component lifecycle
  useEffect(() => {
    console.log('TEMPORARY LOG: AdaptivePracticeModule basic useEffect running!');
  }, []);

  // Commenting out all complex logic for testing
  /*
  const { toast } = useToast();
  const { playCorrectAnswerSound, playWrongAnswerSound } = useSoundEffects();
  const { state, handleNextAtom, handleQuestionAnswer, handleRetry } = useAdaptivePracticeLogic();
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(7)}`);

  const currentAtom = state.atomSequence?.atoms?.[state.currentAtomIndex] || null;
  const totalAtoms = state.atomSequence?.atoms?.length || 0;
  */

  console.log('🧪 SIMPLIFIED TEST: About to render basic JSX');

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back (Simplified Test)
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">
              🧪 SIMPLIFIED AdaptivePracticeModule Test
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center p-8">
            <div className="text-white text-xl mb-4">
              ✅ Basic Component Rendering Test
            </div>
            <div className="text-gray-300 mb-6">
              If you can see this text, the AdaptivePracticeModule component is rendering successfully!
            </div>
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-6">
              <div className="text-blue-300 text-sm">
                <strong>Test Status:</strong> This is the simplified version with all complex logic commented out.
                Check the browser console for "TEMPORARY LOG" message.
              </div>
            </div>
            <Button
              onClick={() => {
                console.log('🔘 SIMPLIFIED TEST: Button clicked!');
                onBack();
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Test Button - Check Console & Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdaptivePracticeModule;
