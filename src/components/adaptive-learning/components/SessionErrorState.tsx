
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';

interface SessionErrorStateProps {
  error: string;
  onBack: () => void;
  onRetry: () => void;
}

const SessionErrorState = ({ error, onBack, onRetry }: SessionErrorStateProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="text-white border-gray-600 hover:bg-gray-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
      
      <Card className="bg-red-900 border-red-700">
        <CardContent className="p-6 text-center text-white">
          <Brain className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Questions</h3>
          <p className="text-red-300 mb-4">{error}</p>
          <Button onClick={onRetry}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionErrorState;
