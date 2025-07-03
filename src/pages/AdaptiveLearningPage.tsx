
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FocusedGrade3Test from '@/components/adaptive-learning/components/FocusedGrade3Test';
import Grade3FractionTestTrigger from '@/components/adaptive-learning/components/Grade3FractionTestTrigger';

const AdaptiveLearningPage = () => {
  const [showTests, setShowTests] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Adaptive Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">Experience personalized learning paths.</p>
            <Button 
              onClick={() => setShowTests(!showTests)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {showTests ? 'Hide' : 'Show'} Grade 3 Fraction Tests
            </Button>
          </CardContent>
        </Card>

        {showTests && (
          <div className="space-y-6">
            <FocusedGrade3Test />
            <Grade3FractionTestTrigger />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdaptiveLearningPage;
