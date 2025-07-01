
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { TestResult } from '../config/grade3FractionTestCases';
import { grade3FractionTestCases } from '../config/grade3FractionTestCases';
import { analyzeGradeLevel, analyzeConceptualFocus, getContentQualityBadge } from '../utils/grade3FractionTestUtils';

interface Grade3TestResultsProps {
  testResults: TestResult[];
}

const Grade3TestResults: React.FC<Grade3TestResultsProps> = ({ testResults }) => {
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Grade 3 Fraction Test Results & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {testResults.map((result, index) => {
            const testCase = grade3FractionTestCases.find(tc => tc.kcId === result.kcId.replace('_fallback', ''));
            const isFallback = result.kcId.includes('_fallback');
            const qualityBadge = result.atoms ? getContentQualityBadge(result.atoms) : null;
            
            return (
              <div key={result.kcId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h4 className="font-semibold">
                        {testCase?.description || result.kcId}
                        {isFallback && ' (Fallback Test)'}
                      </h4>
                      <p className="text-sm text-gray-600 font-mono">{result.kcId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {qualityBadge && (
                      <Badge className={qualityBadge.className}>
                        {qualityBadge.text}
                      </Badge>
                    )}
                    {result.duration && (
                      <Badge variant="outline">{result.duration}ms</Badge>
                    )}
                    {isFallback && (
                      <Badge className="bg-orange-100 text-orange-800">Fallback</Badge>
                    )}
                  </div>
                </div>

                {result.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
                    <p className="text-sm text-red-700">Error: {result.error}</p>
                  </div>
                )}

                {result.atoms && result.atoms.length > 0 && (
                  <div className="mt-4">
                    <Separator className="mb-3" />
                    <h5 className="font-medium mb-2">
                      Grade 3 Content Analysis ({result.atoms.length} atoms):
                    </h5>
                    <div className="space-y-3">
                      {result.atoms.map((atom, atomIndex) => (
                        <div key={atomIndex} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline">{atom.atom_type}</Badge>
                            <div className="flex gap-1 flex-wrap">
                              {atom.content?.question && (
                                <Badge className={
                                  analyzeGradeLevel(atom.content.question).includes('Appropriate') 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-yellow-100 text-yellow-800"
                                }>
                                  {analyzeGradeLevel(atom.content.question)}
                                </Badge>
                              )}
                              {atom.content?.question && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  {analyzeConceptualFocus(atom.content.question)}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {atom.content?.question && (
                            <div className="mb-2">
                              <p className="text-sm mb-1"><strong>Question:</strong> {atom.content.question}</p>
                              {atom.content?.options && (
                                <div className="ml-4 text-xs text-gray-600">
                                  <p><strong>Options:</strong> {atom.content.options.join(', ')}</p>
                                  <p><strong>Correct:</strong> {atom.content.correctAnswer} ({atom.content.options?.[atom.content.correctAnswer]})</p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {atom.content?.explanation && (
                            <p className="text-xs text-gray-600 mb-2">
                              <strong>Explanation:</strong> {atom.content.explanation.substring(0, 150)}...
                            </p>
                          )}

                          <div className="mt-2 text-xs text-gray-500 bg-gray-100 p-2 rounded">
                            <strong>Metadata:</strong> Source: {atom.metadata?.source || 'N/A'} | 
                            Math Topic: {atom.metadata?.mathTopic || 'N/A'} |
                            Model: {atom.metadata?.model || 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Grade3TestResults;
