
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, HelpCircle } from 'lucide-react';
import AdaptiveLearningAtomRenderer from '@/components/adaptive-learning/AdaptiveLearningAtomRenderer';
import QuestionCard from '@/components/adaptive-learning/components/QuestionCard';
import { LearningAtom } from '@/types/learning';

// Mock test atom for stealth assessment testing
const createTestAtom = (): LearningAtom => ({
  id: 'stealth-test-atom-001',
  type: 'challenge',
  curriculumObjectiveId: 'test-stealth-logging',
  curriculumObjectiveTitle: 'Stealth Assessment Test Objective',
  subject: 'Mathematics', 
  narrativeContext: 'Welcome to the stealth assessment test! This question will log your interactions.',
  difficulty: 'medium',
  estimatedMinutes: 3,
  interactionType: 'game',
  content: {
    title: 'Test Question for Stealth Assessment',
    description: 'This question is instrumented with stealth assessment logging',
    data: {
      question: 'What is 5 + 7?',
      options: ['10', '12', '13', '15'],
      correctAnswer: 1,
      explanation: 'The answer is 12 because 5 + 7 = 12'
    }
  },
  variantId: 'stealth-test-variant',
  isCompleted: false
});

// Mock question for QuestionCard testing
const createTestQuestion = () => ({
  id: 'stealth-test-question-001',
  question: 'What is 8 × 6?',
  options: ['42', '48', '54', '56'],
  correct: 1,
  explanation: 'The answer is 48 because 8 × 6 = 48',
  learningObjectives: ['multiplication'],
  estimatedTime: 60,
  conceptsCovered: ['basic-multiplication'],
  knowledgeComponentIds: ['kc-multiplication-single-digit']
});

const StealthAssessmentTest: React.FC = () => {
  const navigate = useNavigate();
  const [testAtom] = React.useState(createTestAtom());
  const [testQuestion] = React.useState(createTestQuestion());
  const [hasAnswered, setHasAnswered] = React.useState(false);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | undefined>();
  const [tempSelected, setTempSelected] = React.useState<number | null>(null);
  const [attemptNumber, setAttemptNumber] = React.useState(1);

  React.useEffect(() => {
    console.log('🎯 Stealth Assessment Test Page Loaded');
    console.log('📊 Check console for StealthAssessmentService logs when interacting with components');
  }, []);

  const handleAtomComplete = (performance: any) => {
    console.log('🏁 Atom completed with performance:', performance);
  };

  const handleQuestionOptionClick = (index: number) => {
    console.log(`🖱️ Option ${index} clicked`);
    setTempSelected(index);
  };

  const handleQuestionSubmit = (selectedIndex: number, isCorrect: boolean) => {
    console.log(`📝 Question submitted: Option ${selectedIndex}, Correct: ${isCorrect}`);
    setSelectedAnswer(selectedIndex);
    setHasAnswered(true);
    setAttemptNumber(prev => prev + 1);
  };

  const resetQuestion = () => {
    setHasAnswered(false);
    setSelectedAnswer(undefined);
    setTempSelected(null);
    setAttemptNumber(1);
    console.log('🔄 Question reset for new test');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Stealth Assessment Logging Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg border">
                <h3 className="font-semibold text-foreground mb-2">🔍 Testing Instructions:</h3>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Open your browser's Developer Console (F12)</li>
                  <li>2. Look for logs starting with <code className="bg-background px-1 rounded">🎯 Stealth Assessment Event Logged</code></li>
                  <li>3. Interact with the components below to trigger logging events</li>
                  <li>4. Expected events: CONTENT_VIEW, QUESTION_ATTEMPT, HINT_USAGE</li>
                </ol>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> All interactions are logged to the console. Check for detailed event information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8">
          {/* AdaptiveLearningAtomRenderer Test */}
          <Card>
            <CardHeader>
              <CardTitle>Test 1: AdaptiveLearningAtomRenderer</CardTitle>
              <p className="text-sm text-muted-foreground">
                This component should log CONTENT_VIEW and QUESTION_ATTEMPT events
              </p>
            </CardHeader>
            <CardContent>
              <AdaptiveLearningAtomRenderer
                atom={testAtom}
                onComplete={handleAtomComplete}
              />
            </CardContent>
          </Card>

          {/* QuestionCard Test */}
          <Card>
            <CardHeader>
              <CardTitle>Test 2: QuestionCard Component</CardTitle>
              <p className="text-sm text-muted-foreground">
                This component should log QUESTION_ATTEMPT events with detailed metrics
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuestionCard
                question={testQuestion}
                hasAnswered={hasAnswered}
                selectedAnswer={selectedAnswer}
                tempSelected={tempSelected}
                onOptionClick={handleQuestionOptionClick}
                onAnswerSubmit={handleQuestionSubmit}
                currentAttemptNumber={attemptNumber}
              />
              
              {hasAnswered && (
                <div className="pt-4">
                  <Button onClick={resetQuestion} variant="outline">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Reset Question for Another Test
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Console Output Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Expected Console Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded font-mono text-xs">
                  <div className="text-green-600">🎯 Stealth Assessment Event Logged: CONTENT_VIEW</div>
                  <div className="text-blue-600">  👀 Content View: contentAtomId, contentType, timeViewed</div>
                </div>
                
                <div className="p-3 bg-muted rounded font-mono text-xs">
                  <div className="text-green-600">🎯 Stealth Assessment Event Logged: QUESTION_ATTEMPT</div>
                  <div className="text-blue-600">  📝 Question Attempt: questionId, isCorrect, timeTaken, attempts</div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Look for these patterns in your console when interacting with the components above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StealthAssessmentTest;
