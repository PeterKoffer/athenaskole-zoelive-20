
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, RefreshCw, Database } from 'lucide-react';

interface EmptyContentStateProps {
  onRefresh: () => void;
  onShowServiceTests: () => void;
}

const EmptyContentState: React.FC<EmptyContentStateProps> = ({ onRefresh, onShowServiceTests }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-10 shadow-xl bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-yellow-300">
          No Content Available
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-10">
        <Info className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
        <p className="text-lg mb-6">
          No learning content could be loaded at this moment. This might be because all available 
          content has been completed or there's an issue fetching new material.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onRefresh}
            variant="outline"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh Content
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

export default EmptyContentState;
