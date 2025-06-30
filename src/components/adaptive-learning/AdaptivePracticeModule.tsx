
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, ArrowLeft, CheckCircle, Loader2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ContentAtomRenderer from './ContentAtomRenderer';
import { useAdaptivePracticeLogic } from './hooks/useAdaptivePracticeLogic';

interface AdaptivePracticeModuleProps {
  onBack: () => void;
}

const AdaptivePracticeModule = ({ onBack }: AdaptivePracticeModuleProps) => {
  const { toast } = useToast();
  const { state, handleNextAtom, handleQuestionAnswer, handleRetry } = useAdaptivePracticeLogic();
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(7)}`);

  const currentAtom = state.atomSequence?.atoms?.[state.currentAtomIndex] || null;
  const totalAtoms = state.atomSequence?.atoms?.length || 0;

  console.log('🔍 AdaptivePracticeModule state:', {
    hasProfile: !!state.learnerProfile,
    hasCurrentKc: !!state.currentKc,
    hasAtomSequence: !!state.atomSequence,
    currentAtomIndex: state.currentAtomIndex,
    totalAtoms,
    hasCurrentAtom: !!currentAtom,
    currentAtomType: currentAtom?.atom_type,
    isLoading: state.isLoading,
    error: state.error,
    sessionId,
    atomSequenceId: state.atomSequence?.sequence_id
  });

  const handleQuestionComplete = (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => {
    console.log('📝 Question completed:', {
      ...result,
      questionIndex: state.currentAtomIndex,
      totalQuestions: totalAtoms,
      atomType: currentAtom?.atom_type
    });

    if (!currentAtom) {
      console.error('❌ No current atom to process');
      return;
    }

    // Handle the answer with stealth assessment
    handleQuestionAnswer(currentAtom, result.selectedAnswer.toString(), result.isCorrect);

    // Show feedback briefly, then move to next
    setTimeout(() => {
      if (state.currentAtomIndex < totalAtoms - 1) {
        handleNextAtom();
      } else {
        // Session complete - generate new content
        toast({
          title: "Great Job! 🎉",
          description: `You've completed all questions for ${state.currentKc?.name}!`,
        });
        
        setTimeout(() => {
          console.log('🔄 Generating new content batch...');
          handleNextAtom(); // This will trigger new content generation
        }, 2000);
      }
    }, 3000);
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center mb-6">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Preparing Your AI Learning Experience
            </h2>
            <p className="text-gray-300 mb-6">
              Our AI is creating personalized content just for you...
            </p>
            <Progress value={65} className="w-full h-3" />
            <div className="flex items-center justify-center mt-6 text-sm text-gray-400">
              <Lightbulb className="w-4 h-4 mr-2" />
              Generating AI content with ContentOrchestrator
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-red-900/20 border-red-700">
          <CardHeader>
            <CardTitle className="text-red-400 text-center">
              AI Generation Error
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-6">{state.error}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={onBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={handleRetry}>
                Try AI Generation Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentAtom) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-yellow-900/20 border-yellow-700">
          <CardContent className="p-8 text-center">
            <p className="text-yellow-300 mb-4">No AI content atom available</p>
            <p className="text-gray-400 text-sm mb-6">
              Sequence ID: {state.atomSequence?.sequence_id || 'None'}<br/>
              Total atoms: {totalAtoms}<br/>
              Current index: {state.currentAtomIndex}
            </p>
            <Button onClick={handleRetry}>
              Retry AI Generation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            Back
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Question {state.currentAtomIndex + 1} of {totalAtoms}
            </div>
            <Progress 
              value={((state.currentAtomIndex + 1) / totalAtoms) * 100} 
              className="w-32 h-2" 
            />
          </div>
        </div>

        <div className="mb-6">
          <Card className="bg-blue-900/20 border-blue-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-white font-medium">
                      {state.currentKc?.name || 'Loading AI Content...'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Grade {state.currentKc?.gradeLevels?.[0] || 'N/A'} • {state.currentKc?.subject} • AI Generated
                    </p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <ContentAtomRenderer
          atom={currentAtom}
          onComplete={handleQuestionComplete}
        />
      </div>
    </div>
  );
};

export default AdaptivePracticeModule;
