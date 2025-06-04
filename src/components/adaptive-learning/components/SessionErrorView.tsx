
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';

interface SessionErrorViewProps {
  onBack: () => void;
  onGenerate: () => void;
}

const SessionErrorView = ({ onBack, onGenerate }: SessionErrorViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="text-white border-gray-600 hover:bg-gray-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
      
      <Card className="bg-yellow-900 border-yellow-700">
        <CardContent className="p-6 text-center text-white">
          <Brain className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Question Not Available</h3>
          <p className="text-yellow-300 mb-4">Let's generate your first question!</p>
          <Button onClick={onGenerate} className="bg-yellow-500 text-black hover:bg-yellow-400">
            Generate Question Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionErrorView;
