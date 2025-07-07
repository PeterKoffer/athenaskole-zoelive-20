import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';

const SimpleStealthTest: React.FC = () => {
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
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Simple Stealth Assessment Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>This is a simplified version of the stealth assessment test.</p>
              <p>If you can see this, the basic routing and rendering is working.</p>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Test Instructions:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Open your browser's Developer Console (F12)</li>
                  <li>Click the button below to test logging</li>
                  <li>Check the console for log messages</li>
                </ol>
              </div>

              <Button 
                onClick={() => {
                  console.log('🎯 Test button clicked!');
                  console.log('🔍 This confirms JavaScript is working');
                }}
                className="w-full"
              >
                Test Console Logging
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleStealthTest;