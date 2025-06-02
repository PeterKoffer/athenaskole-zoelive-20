
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-lime-400 animate-pulse" />
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">AI is generating your question...</h3>
            <p className="text-gray-400 text-sm">Please wait while we create a personalized math problem for you</p>
          </div>
          <div className="w-full max-w-xs bg-gray-700 rounded-full h-2">
            <div className="bg-lime-400 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
