
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw } from 'lucide-react';

interface LoadingStatesProps {
  type: 'generating' | 'no-question' | 'login-required';
  gradeLevel?: number;
  standardCode?: string;
  onRefresh?: () => void;
}

const LoadingStates = ({ type, gradeLevel, standardCode, onRefresh }: LoadingStatesProps) => {
  if (type === 'login-required') {
    return (
      <Card className="bg-red-900 border-red-700">
        <CardContent className="p-6 text-center">
          <h3 className="text-white text-lg font-semibold">Login Required</h3>
          <p className="text-red-300 mt-2">Please log in to access the learning session.</p>
        </CardContent>
      </Card>
    );
  }

  if (type === 'generating') {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <Brain className="w-8 h-8 text-lime-400 animate-pulse mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">
            Creating Grade {gradeLevel} Question
          </h3>
          <p className="text-gray-400">
            AI is generating content aligned with {standardCode}...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (type === 'no-question') {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <h3 className="text-white text-lg font-semibold">Unable to Load Question</h3>
          <p className="text-gray-400 mt-2">Please try refreshing.</p>
          {onRefresh && (
            <Button onClick={onRefresh} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default LoadingStates;
