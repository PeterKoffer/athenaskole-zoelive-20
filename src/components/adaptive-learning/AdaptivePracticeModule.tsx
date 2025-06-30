
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, ArrowLeft, CheckCircle, Loader2, Lightbulb } from 'lucide-react';
import { LearnerProfile } from '@/types/learnerProfile';
import { KnowledgeComponent } from '@/types/knowledgeComponent';
import { ContentAtom } from '@/types/content';
import learnerProfileService from '@/services/learnerProfileService';
import { useContentGeneration } from './hooks/useContentGeneration';
import { useToast } from '@/hooks/use-toast';
import ContentAtomRenderer from './ContentAtomRenderer';

interface AdaptivePracticeModuleProps {
  onBack: () => void;
}

const AdaptivePracticeModule = ({ onBack }: AdaptivePracticeModuleProps) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [currentKc, setCurrentKc] = useState<KnowledgeComponent | null>(null);
  const [atomSequence, setAtomSequence] = useState<any>(null);
  const [currentAtomIndex, setCurrentAtomIndex] = useState(0);
  const [sessionKcs, setSessionKcs] = useState<KnowledgeComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Loading your profile...');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  
  const { recommendAndLoadContent } = useContentGeneration();

  const currentAtom = atomSequence?.atoms?.[currentAtomIndex] || null;
  const totalAtoms = atomSequence?.atoms?.length || 0;

  console.log('🔍 AdaptivePracticeModule state:', {
    hasProfile: !!profile,
    hasCurrentKc: !!currentKc,
    hasAtomSequence: !!atomSequence,
    currentAtomIndex,
    totalAtoms,
    hasCurrentAtom: !!currentAtom,
    currentAtomType: currentAtom?.atom_type,
    isLoading,
    error,
    sessionId
  });

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Generate content when profile is ready
  useEffect(() => {
    if (profile && !isLoading && !currentKc) {
      console.log('🎯 Profile ready, generating content...');
      generateContent();
    }
  }, [profile, isLoading, currentKc]);

  const loadProfile = async () => {
    try {
      console.log('🚀 AdaptivePracticeModule: Loading initial profile...');
      setLoadingMessage('Analyzing your learning profile...');
      
      const testUserId = '12345678-1234-5678-9012-123456789012';
      const loadedProfile = await learnerProfileService.getProfile(testUserId);
      
      if (loadedProfile) {
        console.log('✅ Profile loaded successfully:', loadedProfile.userId);
        setProfile(loadedProfile);
      } else {
        throw new Error('Failed to load profile');
      }
    } catch (error) {
      console.error('❌ Error loading profile:', error);
      setError('Failed to load learning profile. Please refresh and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateContent = async () => {
    if (!profile) return;
    
    setIsLoading(true);
    setLoadingMessage('Generating personalized questions...');
    
    console.log('🎲 Generating content with enhanced uniqueness for session:', sessionId);
    
    await recommendAndLoadContent(
      profile,
      sessionKcs,
      (kc, sequence) => {
        console.log('✅ Content generated successfully:', {
          kcName: kc.name,
          atomsCount: sequence.atoms.length,
          atomTypes: sequence.atoms.map(atom => atom.atom_type),
          sessionId
        });
        
        setCurrentKc(kc);
        setAtomSequence(sequence);
        setSessionKcs(prev => [...prev, kc]);
        setCurrentAtomIndex(0);
        setIsLoading(false);
        
        toast({
          title: "Content Ready! 🎯",
          description: `Generated ${sequence.atoms.length} personalized questions for ${kc.name}`,
        });
      },
      (errorMsg) => {
        console.error('❌ Content generation failed:', errorMsg);
        setError(errorMsg);
        setIsLoading(false);
      }
    );
  };

  const handleQuestionComplete = (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => {
    console.log('📝 Question completed:', {
      ...result,
      questionIndex: currentAtomIndex,
      totalQuestions: totalAtoms,
      atomType: currentAtom?.atom_type
    });
    
    if (currentAtomIndex < totalAtoms - 1) {
      setCurrentAtomIndex(prev => prev + 1);
    } else {
      // Session complete
      toast({
        title: "Great Job! 🎉",
        description: `You've completed all questions for ${currentKc?.name}!`,
      });
      
      // Generate next KC content with enhanced uniqueness
      setTimeout(() => {
        console.log('🔄 Generating new content batch with fresh session context...');
        generateContent();
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center mb-6">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {loadingMessage}
            </h2>
            <p className="text-gray-300 mb-6">
              Our AI is creating the perfect learning experience for you...
            </p>
            <Progress value={65} className="w-full h-3" />
            <div className="flex items-center justify-center mt-6 text-sm text-gray-400">
              <Lightbulb className="w-4 h-4 mr-2" />
              Analyzing your knowledge level and generating personalized content
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-red-900/20 border-red-700">
          <CardHeader>
            <CardTitle className="text-red-400 text-center">
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={onBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
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
              Question {currentAtomIndex + 1} of {totalAtoms}
            </div>
            <Progress 
              value={((currentAtomIndex + 1) / totalAtoms) * 100} 
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
                      {currentKc?.name || 'Loading...'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Grade {currentKc?.gradeLevels?.[0] || 'N/A'} • {currentKc?.subject}
                    </p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {currentAtom ? (
          <ContentAtomRenderer
            atom={currentAtom}
            onComplete={handleQuestionComplete}
          />
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <p className="text-gray-400">No content available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdaptivePracticeModule;
