import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="p-4 text-white"> {/* Added text-white for visibility on dark background */}
      <h1 className="text-2xl font-bold">Minimal Test Page</h1>
      <p>If you see this, basic rendering and routing to /test are working.</p>
      <button
        onClick={() => console.log('TestPage button clicked!')}
        className="mt-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
      >
        Click Me for Console Log
      </button>

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Button onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Minimal Test Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>If you see this, basic rendering and routing to /test are working.</p>
              <Button
                onClick={() => console.log('TestPage button clicked!')}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
              >
                Click Me for Console Log
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestPage;
