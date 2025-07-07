import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const TestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Button onClick={() => navigate('/')} className="mb-6">
          ← Back to Home
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Page</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a simple test page to verify routing works.</p>
            <p>If you can see this, routing is working fine.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestPage;