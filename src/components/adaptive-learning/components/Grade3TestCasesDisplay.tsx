
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import { grade3FractionTestCases } from '../config/grade3FractionTestCases';

const Grade3TestCasesDisplay: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Grade 3 Fraction Test Cases
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {grade3FractionTestCases.map((testCase, index) => (
            <div key={testCase.kcId} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{testCase.description}</h4>
                  <p className="text-sm text-gray-600 font-mono">{testCase.kcId}</p>
                </div>
                <Badge variant="default">Grade 3 Focus</Badge>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Focus:</strong> {testCase.focus}
              </p>
              <p className="text-xs text-blue-600">
                <strong>Expected Questions:</strong> {testCase.expectedQuestions}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Grade3TestCasesDisplay;
