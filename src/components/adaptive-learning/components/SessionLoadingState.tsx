
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';

interface SessionLoadingStateProps {
  subject: string;
  onBack: () => void;
  onGenerate?: () => void;
  showGenerateButton?: boolean;
}

const SessionLoadingState = ({ 
  subject, 
  onBack, 
  onGenerate, 
  showGenerateButton = false 
}: SessionLoadingStateProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="border-gray-600 text-slate-950 bg-slate-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <Brain className="w-12 h-12 text-lime-400 animate-pulse mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Nelie is Preparing Your Questions
            </h3>
            <p className="text-gray-300 mb-4">
              Creating personalized {subject} questions just for you...
            </p>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            {showGenerateButton && onGenerate && (
              <Button onClick={onGenerate} className="mt-4 bg-lime-400 text-black hover:bg-lime-500">
                Generate First Question
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionLoadingState;
