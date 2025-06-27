
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Database } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onShowServiceTests: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onShowServiceTests }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-10 shadow-xl bg-red-900/20 border-red-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-red-300 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 mr-3" /> Error
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-10">
        <p className="text-lg mb-6">{error}</p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onRetry}
            variant="destructive" 
            className="bg-red-500 hover:bg-red-600"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </Button>
          <Button
            onClick={onShowServiceTests}
            variant="outline"
            className="text-white border-white"
          >
            <Database className="h-5 w-5 mr-2" />
            Service Tests
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
