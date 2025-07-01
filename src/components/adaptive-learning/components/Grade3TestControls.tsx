
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Clock, BookOpen, ArrowLeft } from 'lucide-react';

interface Grade3TestControlsProps {
  onBack: () => void;
  onRunTests: () => void;
  isRunning: boolean;
  currentTest: string | null;
}

const Grade3TestControls: React.FC<Grade3TestControlsProps> = ({
  onBack,
  onRunTests,
  isRunning,
  currentTest
}) => {
  return (
    <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-400" />
          Grade 3 Fraction Conceptual Understanding Test Suite
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Button 
            onClick={onBack}
            variant="outline"
            className="text-white border-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tests
          </Button>
          <Button 
            onClick={onRunTests}
            disabled={isRunning}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isRunning ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Running Grade 3 Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Grade 3 Fraction Tests
              </>
            )}
          </Button>
        </div>

        {isRunning && currentTest && (
          <div className="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
            <p className="text-blue-300">
              Currently testing: <span className="font-mono text-blue-200">{currentTest}</span>
            </p>
          </div>
        )}

        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-600">
          <h4 className="text-blue-200 font-semibold mb-2">🎯 Grade 3 Fraction Test Focus:</h4>
          <ul className="text-blue-300 text-sm space-y-1">
            <li>• Conceptual understanding vs computational problems</li>
            <li>• Unit fractions (1/2, 1/3, 1/4) as per 3.NF.A.1 standard</li>
            <li>• Visual fraction representations and "parts of whole" questions</li>
            <li>• Grade 3 appropriate vocabulary and complexity</li>
            <li>• Prompt generation analysis for conceptual topics</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Grade3TestControls;
