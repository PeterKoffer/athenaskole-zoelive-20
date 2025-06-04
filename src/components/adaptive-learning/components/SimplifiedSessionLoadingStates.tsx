
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';

interface SimplifiedSessionLoadingStatesProps {
  user: any;
  isGenerating: boolean;
  currentQuestion: any;
  onBack: () => void;
}

const SimplifiedSessionLoadingStates = ({
  user,
  isGenerating,
  currentQuestion,
  onBack
}: SimplifiedSessionLoadingStatesProps) => {
  if (!user) {
    return (
      <Card className="bg-red-900 border-red-700">
        <CardContent className="p-6 text-center">
          <h3 className="text-white text-lg font-semibold">Login Required</h3>
          <p className="text-red-300 mt-2">Please log in to access the learning session.</p>
        </CardContent>
      </Card>
    );
  }

  if (isGenerating && !currentQuestion) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <Brain className="w-8 h-8 text-lime-400 animate-pulse mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">Preparing Your Question</h3>
          <p className="text-gray-400">AI is creating a personalized question for you...</p>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <h3 className="text-white text-lg font-semibold">Unable to Load Question</h3>
          <p className="text-gray-400 mt-2">Please try refreshing the page.</p>
          <Button onClick={onBack} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default SimplifiedSessionLoadingStates;
