
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Brain, CheckCircle, XCircle, Lightbulb, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useAdaptivePracticeLogic } from './hooks/useAdaptivePracticeLogic';
import StableMultipleChoiceRenderer from './atoms/StableMultipleChoiceRenderer';
import TextExplanationRenderer from './atoms/TextExplanationRenderer';

interface AdaptivePracticeModuleProps {
  onBack: () => void;
}

const AdaptivePracticeModule = ({ onBack }: AdaptivePracticeModuleProps) => {
  console.log('🔍 AdaptivePracticeModule rendering - full version with hook');

  const { toast } = useToast();
  const { playCorrectAnswerSound, playWrongAnswerSound } = useSoundEffects();
  const { state, handleNextAtom, handleQuestionAnswer, handleRetry } = useAdaptivePracticeLogic();
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(7)}`);

  console.log('🔍 AdaptivePracticeModule state:', {
    isLoading: state.isLoading,
    error: state.error,
    hasProfile: !!state.learnerProfile,
    hasKc: !!state.currentKc,
    hasAtomSequence: !!state.atomSequence,
    currentAtomIndex: state.currentAtomIndex,
    atomsLength: state.atomSequence?.atoms?.length || 0
  });

  const currentAtom = state.atomSequence?.atoms?.[state.currentAtomIndex] || null;
  const totalAtoms = state.atomSequence?.atoms?.length || 0;

  console.log('🔍 Current atom details:', {
    hasCurrentAtom: !!currentAtom,
    atomType: currentAtom?.atom_type,
    atomId: currentAtom?.atom_id,
    totalAtoms,
    currentIndex: state.currentAtomIndex
  });

  // Loading state
  if (state.isLoading) {
    console.log('🔍 Rendering loading state');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center mb-6">
              <Brain className="w-12 h-12 text-blue-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Preparing Your Adaptive Learning Experience
            </h2>
            <p className="text-gray-300 mb-6">
              Analyzing your learning profile and generating personalized content...
            </p>
            <Progress value={75} className="w-full h-3" />
            <p className="text-sm text-gray-400 mt-4">
              This will only take a moment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (state.error) {
    console.log('🔍 Rendering error state:', state.error);
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
          </div>

          <Card className="bg-red-900/20 border-red-700">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Learning Content Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-300 mb-4">
                We encountered an issue loading your personalized learning content:
              </p>
              <div className="bg-red-900/30 p-3 rounded-lg mb-4">
                <code className="text-red-200 text-sm">{state.error}</code>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleRetry}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main content state
  console.log('🔍 Rendering main content state');
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-right">
            <div className="text-sm text-gray-400">
              Question {state.currentAtomIndex + 1} of {totalAtoms}
            </div>
            <Progress 
              value={((state.currentAtomIndex + 1) / totalAtoms) * 100} 
              className="w-32 h-2 mt-1"
            />
          </div>
        </div>

        {/* Current KC Info */}
        {state.currentKc && (
          <Card className="bg-blue-900/20 border-blue-700 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-300 text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Learning Focus: {state.currentKc.name}
              </CardTitle>
            </CardHeader>
          </Card>
        )}

        {/* Content Renderer */}
        {currentAtom ? (
          <div className="space-y-6">
            {currentAtom.atom_type === 'TEXT_EXPLANATION' && (
              <TextExplanationRenderer
                content={currentAtom.content || {}}
                atomId={currentAtom.atom_id || 'unknown'}
                onComplete={(result) => {
                  console.log('📖 Text explanation completed:', result);
                  handleNextAtom();
                }}
              />
            )}
            
            {currentAtom.atom_type === 'QUESTION_MULTIPLE_CHOICE' && (
              <StableMultipleChoiceRenderer
                atom={currentAtom}
                onComplete={(result) => {
                  console.log('🔍 Question completed:', result);
                  
                  const { isCorrect, selectedAnswer } = result;
                  
                  // Play sound feedback
                  if (isCorrect) {
                    playCorrectAnswerSound();
                  } else {
                    playWrongAnswerSound();
                  }

                  // Show toast feedback
                  toast({
                    title: isCorrect ? "Correct!" : "Not quite right",
                    description: isCorrect 
                      ? "Great job! Keep it up." 
                      : "Don't worry, learning from mistakes helps you grow!",
                    variant: isCorrect ? "default" : "destructive",
                  });

                  // Convert selectedAnswer index to actual answer string
                  const userAnswerText = currentAtom.content.options?.[selectedAnswer] || 'Unknown';

                  // Update learning profile
                  handleQuestionAnswer(currentAtom, userAnswerText, isCorrect);

                  // Move to next atom after a short delay
                  setTimeout(() => {
                    handleNextAtom();
                  }, 2000);
                }}
              />
            )}
          </div>
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">
                No Content Available
              </h3>
              <p className="text-gray-300 mb-6">
                We're having trouble loading your learning content right now.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleRetry}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdaptivePracticeModule;
