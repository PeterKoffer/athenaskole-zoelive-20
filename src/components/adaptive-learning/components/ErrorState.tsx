
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <Card className="bg-red-900 border-red-700">
      <CardContent className="p-6 text-center text-white">
        <h3 className="text-lg font-semibold mb-2">Error Loading Question</h3>
        <p className="text-red-300">Failed to generate AI content.</p>
        <Button 
          onClick={onRetry}
          className="mt-4 bg-red-600 hover:bg-red-700"
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
