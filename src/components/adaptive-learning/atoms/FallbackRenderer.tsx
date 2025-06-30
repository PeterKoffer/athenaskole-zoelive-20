
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface FallbackRendererProps {
  atom: any;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const FallbackRenderer: React.FC<FallbackRendererProps> = ({ atom, onComplete }) => {
  const [startTime] = React.useState(Date.now());

  const handleContinue = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    console.log('⚠️ Fallback renderer used:', {
      atomId: atom?.atom_id || 'unknown',
      atomType: atom?.atom_type || 'unknown',
      timeSpent
    });
    
    onComplete({ 
      isCorrect: true, 
      selectedAnswer: 0, 
      timeSpent 
    });
  };

  return (
    <Card className="bg-yellow-900/20 border-yellow-700">
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Content Not Available
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-yellow-200">
          {atom ? (
            <p>
              Unable to display content of type: <code className="bg-yellow-800/30 px-2 py-1 rounded">{atom.atom_type}</code>
            </p>
          ) : (
            <p>No content available to display.</p>
          )}
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button 
            onClick={handleContinue}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Continue Anyway
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FallbackRenderer;
