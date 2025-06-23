
import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Palette, Sparkles, CheckCircle } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface CreativeExplorationActivityProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const CreativeExplorationActivity = ({ activity, onActivityComplete }: CreativeExplorationActivityProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [ideas, setIdeas] = useState<string[]>([]);
  
  const steps = [
    {
      title: "Creative Thinking",
      icon: <Lightbulb className="w-8 h-8 text-yellow-400" />,
      prompt: activity.content?.creativePrompt || "Let's think creatively about this topic!"
    },
    {
      title: "Exploration",
      icon: <Palette className="w-8 h-8 text-purple-400" />,
      prompt: activity.content?.whatIfScenario || "What if we approached this differently?"
    },
    {
      title: "Discovery",
      icon: <Sparkles className="w-8 h-8 text-blue-400" />,
      prompt: activity.content?.explorationTask || "What interesting connections can you make?"
    }
  ];

  const handleStepComplete = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setTimeout(() => onActivityComplete(true), 1000);
    }
  }, [currentStep, steps.length, onActivityComplete]);

  const handleAddIdea = useCallback((idea: string) => {
    setIdeas(prev => [...prev, idea]);
  }, []);

  const currentStepData = steps[currentStep];

  return (
    <Card className="bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-400">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-4">{activity.title}</h3>
          <div className="flex justify-center mb-4">
            {currentStepData.icon}
          </div>
          <Badge className="bg-indigo-600 text-white px-4 py-2 mb-4">
            Step {currentStep + 1} of {steps.length}: {currentStepData.title}
          </Badge>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h4 className="text-xl text-white mb-4 text-center">
            {currentStepData.title} Challenge
          </h4>
          <p className="text-gray-300 text-lg mb-6 text-center leading-relaxed">
            {currentStepData.prompt}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button
              onClick={() => {
                handleAddIdea("Creative idea 1");
                handleStepComplete();
              }}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-4 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Explore This Path
            </Button>
            <Button
              onClick={() => {
                handleAddIdea("Creative idea 2");
                handleStepComplete();
              }}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-4 text-lg"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Try This Approach
            </Button>
          </div>

          {ideas.length > 0 && (
            <div className="bg-indigo-800 rounded-lg p-4">
              <h5 className="text-white font-semibold mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Your Creative Ideas:
              </h5>
              <ul className="text-indigo-200 space-y-1">
                {ideas.map((idea, index) => (
                  <li key={index}>• {idea}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentStep ? 'bg-indigo-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreativeExplorationActivity;
