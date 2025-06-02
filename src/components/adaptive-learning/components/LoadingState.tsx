
import { Card, CardContent } from '@/components/ui/card';
import { Brain } from 'lucide-react';

const LoadingState = () => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-center space-x-2">
          <Brain className="w-6 h-6 text-lime-400 animate-pulse" />
          <span className="text-white">AI is generating your question...</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
