
import React from 'react';

const SimpleStealthTest: React.FC = () => {
  return (
    <div className="p-4 text-white"> {/* Added text-white for visibility on dark background */}
      <h1 className="text-2xl font-bold">Simple Stealth Test Page</h1>
      <p>This is a placeholder page for a route imported from the main branch.</p>
      <p>Its primary purpose here is to resolve a build error in App.tsx.</p>


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';
import QuestionCard, { QuestionCardQuestion } from '@/components/adaptive-learning/components/QuestionCard';
import stealthAssessmentService from '@/services/stealthAssessment/StealthAssessmentService';

const SimpleStealthTest: React.FC = () => {
  const navigate = useNavigate();
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>();
  const [tempSelected, setTempSelected] = useState<number | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);

  // Mock question data for testing
  const mockQuestion: QuestionCardQuestion = {
    id: 'test-question-1',
    question: 'What is 5 + 3?',
    options: ['6', '7', '8', '9'],
    correct: 2, // Answer is 8
    explanation: '5 + 3 = 8',
    learningObjectives: ['basic-addition'],
    estimatedTime: 30,
    conceptsCovered: ['addition'],
    knowledgeComponentIds: ['kc-addition-single-digit']
  };

  const handleOptionClick = (index: number) => {
    setTempSelected(index);
  };

  const handleSubmit = (selectedIndex: number, isCorrect: boolean) => {
    setSelectedAnswer(selectedIndex);
    setHasAnswered(true);
    console.log(`✅ Question answered: Option ${selectedIndex}, Correct: ${isCorrect}`);
  };

  const resetTest = () => {
    setHasAnswered(false);
    setSelectedAnswer(undefined);
    setTempSelected(null);
    setAttemptNumber(1);
    stealthAssessmentService.clearQueue();
    console.log('🔄 Test reset');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Button onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Stealth Assessment Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Test the stealth assessment logging by interacting with the question below.</p>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Instructions:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Open browser Developer Console (F12)</li>
                  <li>Answer the question below</li>
                  <li>Check console for stealth assessment logs</li>
                  <li>Look for logs starting with "🎯 Stealth Assessment Event Logged"</li>
                </ol>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => {
                    console.log('🎯 Manual test log');
                    console.log('📊 Recent events:', stealthAssessmentService.getRecentEvents(5));
                  }}
                  variant="outline"
                >
                  Test Logging
                </Button>
                <Button onClick={resetTest} variant="outline">
                  Reset Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Card for Testing */}
        <QuestionCard
          question={mockQuestion}
          hasAnswered={hasAnswered}
          selectedAnswer={selectedAnswer}
          tempSelected={tempSelected}
          onOptionClick={handleOptionClick}
          onAnswerSubmit={handleSubmit}
          currentAttemptNumber={attemptNumber}
        />
      </div>
    </div>
  );
};

export default SimpleStealthTest;
