
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertTriangle, Eye, Brain, Target } from 'lucide-react';

interface TestResultsAnalyzerProps {
  results: any[];
}

const TestResultsAnalyzer: React.FC<TestResultsAnalyzerProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return null;
  }

  const analyzeQuestionQuality = (question: string) => {
    const lowerQ = question.toLowerCase();
    
    const qualityScores = {
      conceptual: lowerQ.includes('fraction') && (lowerQ.includes('part') || lowerQ.includes('whole')) ? 1 : 0,
      visual: lowerQ.includes('shaded') || lowerQ.includes('circle') || lowerQ.includes('diagram') ? 1 : 0,
      unitFraction: lowerQ.includes('1/') || lowerQ.includes('one half') || lowerQ.includes('one third') ? 1 : 0,
      gradeAppropriate: question.split(' ').length <= 25 && !lowerQ.includes('calculate') && !lowerQ.includes('compute') ? 1 : 0
    };
    
    const totalScore = Object.values(qualityScores).reduce((a, b) => a + b, 0);
    
    return {
      score: totalScore,
      maxScore: 4,
      breakdown: qualityScores,
      rating: totalScore >= 3 ? 'Excellent' : totalScore >= 2 ? 'Good' : totalScore >= 1 ? 'Fair' : 'Needs Improvement'
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Comprehensive Test Results Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {results.filter(r => r.status === 'success').length}
              </div>
              <p className="text-sm text-gray-600">Successful Tests</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {results.reduce((acc, r) => acc + (r.atoms?.length || 0), 0)}
              </div>
              <p className="text-sm text-gray-600">Total Atoms Generated</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(results.filter(r => r.duration).reduce((acc, r) => acc + r.duration, 0) / results.filter(r => r.duration).length) || 0}ms
              </div>
              <p className="text-sm text-gray-600">Avg Generation Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {results.filter(r => r.status === 'error').length}
              </div>
              <p className="text-sm text-gray-600">Failed Tests</p>
            </div>
          </div>

          <Separator className="my-6" />

          {results.map((result, index) => (
            <div key={result.kcId} className="mb-8 p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {result.status === 'success' ? 
                    <CheckCircle className="w-6 h-6 text-green-500" /> :
                    <XCircle className="w-6 h-6 text-red-500" />
                  }
                  <div>
                    <h3 className="font-semibold">{result.kcId}</h3>
                    <p className="text-sm text-gray-600">
                      {result.status === 'success' ? 
                        `Generated ${result.atoms?.length || 0} atoms` : 
                        `Failed: ${result.error || result.status}`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                    {result.status}
                  </Badge>
                  {result.duration && (
                    <Badge variant="outline">{result.duration}ms</Badge>
                  )}
                </div>
              </div>

              {result.atoms && result.atoms.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI-Generated Content Analysis
                  </h4>
                  
                  {result.atoms.map((atom: any, atomIndex: number) => {
                    const quality = atom.content?.question ? analyzeQuestionQuality(atom.content.question) : null;
                    
                    return (
                      <div key={atomIndex} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="outline">{atom.atom_type}</Badge>
                          <div className="flex gap-2">
                            {quality && (
                              <Badge className={
                                quality.rating === 'Excellent' ? 'bg-green-100 text-green-800' :
                                quality.rating === 'Good' ? 'bg-blue-100 text-blue-800' :
                                quality.rating === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {quality.rating} ({quality.score}/{quality.maxScore})
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {atom.content?.question && (
                          <div className="mb-3">
                            <p className="font-medium text-sm mb-2">Question:</p>
                            <p className="text-sm bg-white p-3 rounded border">
                              {atom.content.question}
                            </p>
                            
                            {quality && (
                              <div className="mt-2 text-xs text-gray-600">
                                <strong>Quality Analysis:</strong>
                                {quality.breakdown.conceptual ? ' ✓ Conceptual' : ' ✗ Not Conceptual'} |
                                {quality.breakdown.visual ? ' ✓ Visual' : ' ✗ No Visual'} |
                                {quality.breakdown.unitFraction ? ' ✓ Unit Fraction' : ' ✗ No Unit Fraction'} |
                                {quality.breakdown.gradeAppropriate ? ' ✓ Grade Appropriate' : ' ✗ Too Complex'}
                              </div>
                            )}
                            
                            {atom.content?.options && (
                              <div className="mt-2">
                                <p className="text-xs font-medium mb-1">Options & Answer:</p>
                                <div className="text-xs bg-gray-100 p-2 rounded">
                                  {atom.content.options.map((option: string, optIndex: number) => (
                                    <div key={optIndex} className={`
                                      ${optIndex === atom.content.correctAnswer ? 'font-bold text-green-700' : 'text-gray-700'}
                                    `}>
                                      {optIndex === atom.content.correctAnswer ? '✓ ' : '  '}{optIndex}: {option}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {atom.content?.explanation && (
                          <div className="mb-3">
                            <p className="font-medium text-sm mb-1">Explanation:</p>
                            <p className="text-xs text-gray-600 bg-white p-2 rounded border">
                              {atom.content.explanation.substring(0, 200)}...
                            </p>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                          <strong>Metadata:</strong> 
                          Source: {atom.metadata?.source || 'N/A'} | 
                          Model: {atom.metadata?.model || 'N/A'} | 
                          Math Topic: {atom.metadata?.mathTopic || 'N/A'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Console Log Analysis Instructions
            </h4>
            <div className="text-sm space-y-2">
              <p><strong>1. Check Supabase Edge Function Logs:</strong></p>
              <ul className="ml-4 text-xs space-y-1">
                <li>• Look for "🎯 Creating REAL curriculum-enhanced prompt" in prompt_generator.ts</li>
                <li>• Verify "Found relevant curriculum topic" messages</li>
                <li>• Check for "Grade 3 Fraction Content Analysis" logs</li>
              </ul>
              
              <p><strong>2. Validation Logic Analysis:</strong></p>
              <ul className="ml-4 text-xs space-y-1">
                <li>• Look for "🧩 Conceptual unit fraction question detected" in math_utils.ts</li>
                <li>• Check for "ℹ️ No specific arithmetic or known conceptual pattern matched"</li>
                <li>• Verify correctAnswer validation logs</li>
              </ul>
              
              <p><strong>3. Fallback Behavior:</strong></p>
              <ul className="ml-4 text-xs space-y-1">
                <li>• If generation fails, check for "Understanding Unit Fractions" fallback</li>
                <li>• Verify fallback metadata includes Grade 3 specific content</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResultsAnalyzer;
