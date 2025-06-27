
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  title?: string;
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  title = "Loading Adaptive Practice...",
  message = "Preparing your learning experience..."
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-10 shadow-xl bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-blue-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-16 w-16 animate-spin text-blue-400 mb-6" />
        <p className="text-lg">{message}</p>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
