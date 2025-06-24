import React from 'react';
import type { InitialChoicePoint, ChoiceOption } from '@/types/learningAdventureTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdventureImageDisplay from './AdventureImageDisplay'; // Added

interface InitialChoiceScreenProps {
  choicePoint: InitialChoicePoint;
  onChoiceMade: (arcId: string) => void;
}

const InitialChoiceScreen: React.FC<InitialChoiceScreenProps> = ({ choicePoint, onChoiceMade }) => {
  return (
    <Card className="bg-slate-700/80 border-blue-400/60 p-6 animate-fadeIn">
      <CardHeader>
        {choicePoint.narrativeLeadingToChoice && (
          <CardDescription className="text-lg text-blue-200 mb-4">
            {choicePoint.narrativeLeadingToChoice}
          </CardDescription>
        )}
        <CardTitle className="text-2xl font-semibold text-white mb-6">{choicePoint.prompt}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {choicePoint.options.map((option: ChoiceOption) => (
          <Card key={option.id} className="bg-slate-600/70 border-slate-500/50 p-4 hover:bg-slate-500/70 transition-colors duration-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex-grow mb-4 md:mb-0 md:mr-4">
                {option.choiceImagePrompt && (
                  <div className="mb-3 rounded-md overflow-hidden border border-slate-600">
                    <AdventureImageDisplay
                      imagePrompt={option.choiceImagePrompt}
                      altText={`Visual for ${option.displayText}`}
                      className="w-full h-32 md:h-40" // Adjusted height
                      aspectRatio="aspect-video"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-purple-300">{option.displayText}</h3>
                {option.description && (
                  <p className="text-sm text-slate-300 mt-1">{option.description}</p>
                )}
              </div>
              <Button
                onClick={() => onChoiceMade(option.linkedStoryArcId)}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-150 ease-in-out whitespace-nowrap"
                size="lg"
              >
                Choose this Path
              </Button>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default InitialChoiceScreen;
