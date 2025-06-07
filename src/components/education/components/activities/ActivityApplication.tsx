
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Lightbulb, CheckCircle } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityApplicationProps {
  activity: LessonActivity;
  timeRemaining: number;
  onContinue: () => void;
}

const ActivityApplication = ({ activity, timeRemaining, onContinue }: ActivityApplicationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const problemSteps = activity.content.problemSteps || [];

  useEffect(() => {
    if (problemSteps.length === 0) return;

    const stepDuration = activity.duration / problemSteps.length;
    const timer = setTimeout(() => {
      setShowSolution(true);
    }, (stepDuration * 0.6) * 1000); // Show step for 60% of time, then solution

    return () => clearTimeout(timer);
  }, [currentStep, problemSteps, activity.duration]);

  const moveToNextStep = () => {
    if (currentStep < problemSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowSolution(false);
    } else {
      onContinue();
    }
  };

  const currentStepData = problemSteps[currentStep];

  return (
    <Card className="bg-gradient-to-br from-blue-900 to-indigo-900 border-blue-400">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Target className="w-8 h-8 text-blue-400 mr-3" />
          <div>
            <h3 className="text-2xl font-bold text-white">{activity.title}</h3>
            <p className="text-blue-200 text-sm">{activity.phaseDescription}</p>
          </div>
        </div>
        
        <div className="bg-blue-800/30 rounded-lg p-6 mb-6">
          <h4 className="text-blue-300 font-bold text-lg mb-3">Real-World Scenario</h4>
          <p className="text-blue-100 leading-relaxed">{activity.content.scenario}</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-indigo-800/40 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                {currentStep + 1}
              </span>
              <h5 className="text-blue-200 font-semibold">Problem Step {currentStep + 1} of {problemSteps.length}</h5>
            </div>
            <p className="text-white text-lg leading-relaxed mb-4">{currentStepData?.step}</p>
            
            {!showSolution && currentStepData?.hint && (
              <div className="bg-blue-700/30 rounded-lg p-4 border-l-4 border-blue-400">
                <div className="flex items-center mb-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="text-blue-200 font-medium">Hint</span>
                </div>
                <p className="text-blue-100">{currentStepData.hint}</p>
              </div>
            )}
            
            {showSolution && (
              <div className="bg-green-800/30 rounded-lg p-4 border-l-4 border-green-400">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-green-200 font-medium">Solution</span>
                </div>
                <p className="text-green-100 font-medium">{currentStepData?.solution}</p>
              </div>
            )}
          </div>
          
          {showSolution && (
            <div className="text-center">
              <Button
                onClick={moveToNextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                {currentStep < problemSteps.length - 1 ? 'Next Problem Step' : 'Complete Application Phase'}
              </Button>
            </div>
          )}
        </div>
        
        <div className="text-center text-blue-300 mt-6">
          Phase 4 of 6 • Real-World Application • {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')} remaining
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityApplication;
