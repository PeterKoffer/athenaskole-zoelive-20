
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserMetadata } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { universeGenerationService } from '@/services/UniverseGenerationService';
import UniverseSessionManager from '@/services/UniverseSessionManager';
import { LearningAtom, DailyUniverse } from '@/types/learning';
import AdaptiveLearningAtomRenderer from '@/components/adaptive-learning/AdaptiveLearningAtomRenderer';
import { ArrowLeft, RefreshCw, Brain, Sparkles } from 'lucide-react';

const EnhancedDailyProgram: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [dailyUniverse, setDailyUniverse] = useState<DailyUniverse | null>(null);
  const [currentAtomIndex, setCurrentAtomIndex] = useState(0);
  const [completedAtoms, setCompletedAtoms] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const metadata = user?.user_metadata as UserMetadata | undefined;
  const firstName = metadata?.name?.split(' ')[0] || metadata?.first_name || 'Student';
  const studentAge = metadata?.age || 10;

  useEffect(() => {
    if (user) {
      generateDailyUniverse();
    }
  }, [user]);

  const generateDailyUniverse = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    try {
      const universe = await universeGenerationService.generate({
        userId: user.id,
        gradeLevel: metadata?.gradeLevel || 4,
        preferredLearningStyle: metadata?.preferredLearningStyle || 'mixed',
        interests: metadata?.interests || [],
      });
      
      if (universe) {
        // The new service returns a DailyUniverse object directly
        const dailyUniverse: DailyUniverse = {
          ...universe,
          storylineIntro: universe.description || '',
          estimatedTotalMinutes: 45, // Placeholder
          learningAtoms: universe.objectives.map((obj, index) => ({
            id: obj.id,
            title: obj.name,
            subject: obj.subjectName,
            difficulty: 'medium', // Placeholder
            type: 'video', // Placeholder
            content: obj.description,
            order: index,
            isCompleted: false,
          })),
          storylineOutro: 'Congratulations on completing your learning journey!', // Placeholder
        };
        setDailyUniverse(dailyUniverse);
        setCurrentAtomIndex(0);
        setCompletedAtoms([]);
        
        // Initialize UniverseSessionManager with the new universe
        await UniverseSessionManager.startSession(user.id, dailyUniverse);
        console.log('[EnhancedDailyProgram] Started UniverseSessionManager session');
      }
    } catch (error) {
      console.error('Error generating daily universe:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAtomComplete = (performance: any) => {
    console.log('[EnhancedDailyProgram] Atom completed with performance:', performance);
    
    setCompletedAtoms(prev => [...prev, currentAtomIndex]);
    
    if (dailyUniverse && currentAtomIndex < dailyUniverse.learningAtoms.length - 1) {
      setTimeout(() => {
        setCurrentAtomIndex(prev => prev + 1);
      }, 1000);
    } else {
      // All atoms completed - end the session
      setTimeout(() => {
        UniverseSessionManager.endSession();
        console.log('[EnhancedDailyProgram] Ended UniverseSessionManager session');
      }, 1000);
    }
  };

  const resetProgram = () => {
    // End current session before generating new universe
    UniverseSessionManager.endSession();
    generateDailyUniverse();
  };

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎓</div>
          <p className="text-lg">Loading your personalized learning journey...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }

  const currentAtom = dailyUniverse?.learningAtoms[currentAtomIndex];
  const isAllComplete = dailyUniverse && completedAtoms.length === dailyUniverse.learningAtoms.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold">Enhanced Adaptive Learning</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetProgram}
            disabled={isGenerating}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            New Journey
          </Button>
        </div>

        {/* Universe Theme */}
        {dailyUniverse && (
          <Card className="mb-6 bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <CardTitle className="text-white">{dailyUniverse.theme}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">{dailyUniverse.storylineIntro}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>⏱️ Est. Time: {dailyUniverse.estimatedTotalMinutes} minutes</span>
                <span>🎯 Learning Atoms: {dailyUniverse.learningAtoms.length}</span>
                <span>🧠 Adaptive AI: Enabled</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress */}
        {dailyUniverse && (
          <Card className="mb-6 bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                {dailyUniverse.learningAtoms.map((atom, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      completedAtoms.includes(index)
                        ? 'bg-green-500 text-white'
                        : index === currentAtomIndex
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {dailyUniverse.learningAtoms.map((atom, index) => (
                  <Badge
                    key={index}
                    variant={completedAtoms.includes(index) ? "default" : "secondary"}
                    className={completedAtoms.includes(index) ? "bg-green-600" : ""}
                  >
                    {atom.subject} ({atom.difficulty})
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-300 mt-2">
                Completed: {completedAtoms.length} / {dailyUniverse.learningAtoms.length} atoms
              </p>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {isGenerating ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-pulse" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Generating Your Personal Learning Journey
              </h2>
              <p className="text-gray-300">
                Our AI is crafting a unique educational adventure with adaptive difficulty based on your learning history...
              </p>
            </CardContent>
          </Card>
        ) : !dailyUniverse ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Unable to Generate Learning Journey
              </h2>
              <p className="text-gray-300 mb-6">
                We couldn't create your personalized learning experience. Please try again.
              </p>
              <Button onClick={generateDailyUniverse} className="bg-blue-600 hover:bg-blue-700">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : !isAllComplete && currentAtom ? (
          <div className="bg-white rounded-lg">
            <AdaptiveLearningAtomRenderer
              atom={currentAtom}
              onComplete={handleAtomComplete}
            />
          </div>
        ) : isAllComplete ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Adaptive Learning Journey Complete!
              </h2>
              <p className="text-gray-300 mb-4">{dailyUniverse.storylineOutro}</p>
              <p className="text-gray-400 mb-6">
                You've successfully completed your adaptive learning journey. The AI system dynamically adjusted content difficulty based on your real-time performance, and all progress has been saved to inform future learning sessions!
              </p>
              <Button
                onClick={resetProgram}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start New Adaptive Journey
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default EnhancedDailyProgram;
