
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles, HelpCircle } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityCreativeExplorationProps {
  activity: LessonActivity;
  timeRemaining: number;
  onContinue: () => void;
}

const ActivityCreativeExploration = ({ activity, timeRemaining, onContinue }: ActivityCreativeExplorationProps) => {
  const [currentPrompt, setCurrentPrompt] = useState(0);

  const prompts = [
    { icon: Palette, title: "Creative Challenge", content: activity.content.creativePrompt },
    { icon: HelpCircle, title: "What If Scenario", content: activity.content.whatIfScenario },
    { icon: Sparkles, title: "Exploration Task", content: activity.content.explorationTask }
  ].filter(prompt => prompt.content);

  const handleNextPrompt = () => {
    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt(prev => prev + 1);
    } else {
      onContinue();
    }
  };

  const currentPromptData = prompts[currentPrompt];
  const IconComponent = currentPromptData?.icon || Palette;

  return (
    <Card className="bg-gradient-to-br from-purple-900 to-pink-900 border-purple-400">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Palette className="w-8 h-8 text-purple-400 mr-3" />
          <div>
            <h3 className="text-2xl font-bold text-white">{activity.title}</h3>
            <p className="text-purple-200 text-sm">{activity.phaseDescription}</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-purple-800/30 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <IconComponent className="w-8 h-8 text-purple-300 mr-3" />
              <h4 className="text-purple-200 font-bold text-xl">{currentPromptData?.title}</h4>
            </div>
            <p className="text-purple-100 text-lg leading-relaxed">{currentPromptData?.content}</p>
          </div>
          
          <div className="bg-pink-800/20 rounded-lg p-6 border border-pink-600/30">
            <h5 className="text-pink-200 font-semibold mb-3">💭 Take a moment to think...</h5>
            <p className="text-pink-100 text-sm leading-relaxed">
              This is your creative space! There are no wrong answers here. Let your imagination explore new possibilities and connections.
            </p>
          </div>
          
          {/* Prompt Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {prompts.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index <= currentPrompt ? 'bg-purple-400' : 'bg-purple-700'
                }`}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Button
              onClick={handleNextPrompt}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
            >
              {currentPrompt < prompts.length - 1 ? 'Explore Next Idea' : 'Complete Creative Phase'}
            </Button>
          </div>
        </div>
        
        <div className="text-center text-purple-300 mt-6">
          Phase 5 of 6 • Creative Exploration • {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')} remaining
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCreativeExploration;
