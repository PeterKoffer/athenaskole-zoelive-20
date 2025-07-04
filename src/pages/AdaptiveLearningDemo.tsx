
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LearningAtom } from '@/types/learning';
import AdaptiveLearningAtomRenderer from '@/components/adaptive-learning/AdaptiveLearningAtomRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const AdaptiveLearningDemo: React.FC = () => {
  const navigate = useNavigate();
  const [currentAtomIndex, setCurrentAtomIndex] = useState(0);
  const [completedAtoms, setCompletedAtoms] = useState<number[]>([]);

  // Sample learning atoms for demonstration
  const sampleAtoms: LearningAtom[] = [
    {
      id: 'math-addition-1',
      type: 'challenge',
      subject: 'Mathematics',
      curriculumObjectiveId: 'math-basic-addition',
      curriculumObjectiveTitle: 'Basic Addition',
      narrativeContext: 'The space station needs power calculations. Help Engineer Zara add energy units to keep the lights on!',
      estimatedMinutes: 5,
      difficulty: 'medium',
      interactionType: 'puzzle',
      content: {
        title: 'Energy Unit Addition',
        description: 'Calculate the total energy units needed for the space station.',
        data: {
          type: 'multiple_choice',
          standards: ['CCSS.MATH.CONTENT.2.OA.A.1']
        }
      }
    },
    {
      id: 'math-subtraction-1',
      type: 'challenge',
      subject: 'Mathematics',
      curriculumObjectiveId: 'math-basic-subtraction',
      curriculumObjectiveTitle: 'Basic Subtraction',
      narrativeContext: 'Oh no! Some energy units were lost during the meteor shower. Help calculate how many are left!',
      estimatedMinutes: 5,
      difficulty: 'medium',
      interactionType: 'puzzle',
      content: {
        title: 'Energy Unit Loss Calculation',
        description: 'Calculate how many energy units remain after the meteor damage.',
        data: {
          type: 'multiple_choice',
          standards: ['CCSS.MATH.CONTENT.2.OA.A.1']
        }
      }
    },
    {
      id: 'math-multiplication-1',
      type: 'challenge',
      subject: 'Mathematics',
      curriculumObjectiveId: 'math-basic-multiplication',
      curriculumObjectiveTitle: 'Basic Multiplication',
      narrativeContext: 'The space station has multiple floors, each needing the same amount of energy. Calculate the total needed!',
      estimatedMinutes: 7,
      difficulty: 'medium',
      interactionType: 'puzzle',
      content: {
        title: 'Multi-Floor Energy Calculation',
        description: 'Calculate the total energy needed for all floors of the space station.',
        data: {
          type: 'multiple_choice',
          standards: ['CCSS.MATH.CONTENT.3.OA.A.1']
        }
      }
    }
  ];

  const currentAtom = sampleAtoms[currentAtomIndex];

  const handleAtomComplete = (performance: any) => {
    console.log('Atom completed with performance:', performance);
    
    setCompletedAtoms(prev => [...prev, currentAtomIndex]);
    
    if (currentAtomIndex < sampleAtoms.length - 1) {
      setTimeout(() => {
        setCurrentAtomIndex(prev => prev + 1);
      }, 1000);
    }
  };

  const resetDemo = () => {
    setCurrentAtomIndex(0);
    setCompletedAtoms([]);
  };

  const isAllComplete = completedAtoms.length === sampleAtoms.length;

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
            <h1 className="text-2xl font-bold">Adaptive Learning Atoms Demo</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetDemo}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Demo
          </Button>
        </div>

        {/* Progress */}
        <Card className="mb-6 bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              {sampleAtoms.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    completedAtoms.includes(index)
                      ? 'bg-green-500 text-white'
                      : index === currentAtomIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-300 mt-2">
              Completed: {completedAtoms.length} / {sampleAtoms.length} atoms
            </p>
          </CardContent>
        </Card>

        {/* Demo Description */}
        <Card className="mb-6 bg-white/5 border-white/10">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white mb-2">🧠 How Adaptive Learning Works</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <strong>Real-time Adaptation:</strong> Questions adjust difficulty based on your responses</li>
              <li>• <strong>Smart Hints:</strong> Get contextual help when you need it</li>
              <li>• <strong>Performance Tracking:</strong> System learns from your patterns</li>
              <li>• <strong>Personalized Content:</strong> Instructions adapt to your learning style</li>
            </ul>
          </CardContent>
        </Card>

        {/* Main Content */}
        {!isAllComplete ? (
          <div className="bg-white rounded-lg">
            <AdaptiveLearningAtomRenderer
              atom={currentAtom}
              onComplete={handleAtomComplete}
            />
          </div>
        ) : (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Congratulations!
              </h2>
              <p className="text-gray-300 mb-6">
                You've completed all the adaptive learning atoms in this demo.
                The system has been learning from your responses and adapting to help you succeed!
              </p>
              <Button
                onClick={resetDemo}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdaptiveLearningDemo;
