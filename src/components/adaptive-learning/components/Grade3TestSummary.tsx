
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestResult } from '../config/grade3FractionTestCases';
import { grade3FractionTestCases } from '../config/grade3FractionTestCases';

interface Grade3TestSummaryProps {
  testResults: TestResult[];
}

const Grade3TestSummary: React.FC<Grade3TestSummaryProps> = ({ testResults }) => {
  if (testResults.length !== (grade3FractionTestCases.length + 1)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Grade 3 Fraction Test Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {testResults.filter(r => r.status === 'success').length}
            </div>
            <p className="text-sm text-gray-600">Successful Tests</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {testResults.filter(r => r.atoms?.some(atom => 
                atom.content?.question?.toLowerCase().includes('shaded') ||
                atom.content?.question?.toLowerCase().includes('parts')
              )).length}
            </div>
            <p className="text-sm text-gray-600">Visual Questions</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {testResults.filter(r => r.atoms?.some(atom => 
                atom.content?.question?.includes('1/') ||
                atom.content?.question?.toLowerCase().includes('one')
              )).length}
            </div>
            <p className="text-sm text-gray-600">Unit Fraction Focus</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {testResults.filter(r => r.fallbackTest).length}
            </div>
            <p className="text-sm text-gray-600">Fallback Tests</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">🔍 Key Insights for Grade 3 Fractions:</h4>
          <ul className="text-sm space-y-1">
            <li>• <strong>Conceptual Focus:</strong> Check console logs for prompt_generator.ts analysis</li>
            <li>• <strong>Validation Logic:</strong> Review math_utils.ts logs for fraction question handling</li>
            <li>• <strong>Grade Appropriateness:</strong> Analyze vocabulary and complexity in generated questions</li>
            <li>• <strong>Standards Alignment:</strong> Verify 3.NF.A.1 unit fraction emphasis</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Grade3TestSummary;
