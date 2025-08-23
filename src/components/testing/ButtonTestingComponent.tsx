
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
type OptionsProps = { options: string[]; selectedAnswer: number | null; onAnswerSelect: (i:number)=>void; showResult?: boolean; correctAnswer?: number; activityId?: string };
const StableQuizOptions = ({ options, selectedAnswer, onAnswerSelect, showResult, correctAnswer }: OptionsProps) => (
  <div className="space-y-2">
    {options.map((opt, idx) => (
      <Button key={idx} variant={selectedAnswer===idx ? "default":"outline"} onClick={()=>onAnswerSelect(idx)}>
        {opt} {showResult && correctAnswer===idx ? "✓": ""}
      </Button>
    ))}
  </div>
);
const StableQuizSubmitButton = ({ onSubmit, disabled }: { onSubmit: () => void; disabled?: boolean }) => (
  <Button onClick={onSubmit} disabled={disabled}>Submit</Button>
);
const QuestionAnswerOptions = StableQuizOptions as any;
const SimplifiedQuestionDisplay = ({ currentQuestion, selectedAnswer, onAnswerSelect, showResult }: any) => (
  <div>
    <div className="text-white">{currentQuestion.question}</div>
    <StableQuizOptions options={currentQuestion.options} selectedAnswer={selectedAnswer} onAnswerSelect={onAnswerSelect} showResult={showResult} correctAnswer={currentQuestion.correct} />
  </div>
);
const QuestionOptions = StableQuizOptions as any;

const ButtonTestingComponent = () => {
  const [selectedAnswer1, setSelectedAnswer1] = useState<number | null>(null);
  const [selectedAnswer2, setSelectedAnswer2] = useState<number | null>(null);
  const [selectedAnswer3, setSelectedAnswer3] = useState<number | null>(null);
  const [selectedAnswer4, setSelectedAnswer4] = useState<number | null>(null);
  const [showResult1, setShowResult1] = useState(false);
  const [showResult2, setShowResult2] = useState(false);
  const [showResult3, setShowResult3] = useState(false);
  const [showResult4, setShowResult4] = useState(false);

  const testOptions = ['Option A', 'Option B', 'Option C', 'Option D'];
  const correctAnswer = 1; // Option B

  const testQuestion = {
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correct: 1 // Answer: 4
  };

  const resetAll = () => {
    setSelectedAnswer1(null);
    setSelectedAnswer2(null);
    setSelectedAnswer3(null);
    setSelectedAnswer4(null);
    setShowResult1(false);
    setShowResult2(false);
    setShowResult3(false);
    setShowResult4(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Button Testing Dashboard</CardTitle>
            <Button onClick={resetAll} className="bg-red-600 hover:bg-red-700 w-fit">
              Reset All Tests
            </Button>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test 1: StableQuizOptions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Test 1: StableQuizOptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StableQuizOptions
                options={testOptions}
                selectedAnswer={selectedAnswer1}
                onAnswerSelect={setSelectedAnswer1}
                activityId="test-1"
                showResult={showResult1}
                correctAnswer={correctAnswer}
              />
              <div className="flex space-x-2">
                <StableQuizSubmitButton
                  onSubmit={() => setShowResult1(true)}
                  disabled={selectedAnswer1 === null || showResult1}
                />
                <Button 
                  onClick={() => {
                    setSelectedAnswer1(null);
                    setShowResult1(false);
                  }}
                  variant="outline"
                  className="border-gray-600 text-white"
                >
                  Reset
                </Button>
              </div>
              <div className="text-sm text-gray-400">
                Selected: {selectedAnswer1 !== null ? testOptions[selectedAnswer1] : 'None'} | 
                Correct: {testOptions[correctAnswer]} | 
                Show Result: {showResult1 ? 'Yes' : 'No'}
              </div>
            </CardContent>
          </Card>

          {/* Test 2: QuestionAnswerOptions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Test 2: QuestionAnswerOptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuestionAnswerOptions
                options={testOptions}
                selectedAnswer={selectedAnswer2}
                correctAnswer={correctAnswer}
                showResult={showResult2}
                onAnswerSelect={setSelectedAnswer2}
              />
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowResult2(true)}
                  disabled={selectedAnswer2 === null || showResult2}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Submit
                </Button>
                <Button 
                  onClick={() => {
                    setSelectedAnswer2(null);
                    setShowResult2(false);
                  }}
                  variant="outline"
                  className="border-gray-600 text-white"
                >
                  Reset
                </Button>
              </div>
              <div className="text-sm text-gray-400">
                Selected: {selectedAnswer2 !== null ? testOptions[selectedAnswer2] : 'None'} | 
                Show Result: {showResult2 ? 'Yes' : 'No'}
              </div>
            </CardContent>
          </Card>

          {/* Test 3: SimplifiedQuestionDisplay */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Test 3: SimplifiedQuestionDisplay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SimplifiedQuestionDisplay
                currentQuestion={testQuestion}
                selectedAnswer={selectedAnswer3}
                showResult={showResult3}
                onAnswerSelect={setSelectedAnswer3}
              />
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowResult3(true)}
                  disabled={selectedAnswer3 === null || showResult3}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Submit
                </Button>
                <Button 
                  onClick={() => {
                    setSelectedAnswer3(null);
                    setShowResult3(false);
                  }}
                  variant="outline"
                  className="border-gray-600 text-white"
                >
                  Reset
                </Button>
              </div>
              <div className="text-sm text-gray-400">
                Selected: {selectedAnswer3 !== null ? testQuestion.options[selectedAnswer3] : 'None'} | 
                Show Result: {showResult3 ? 'Yes' : 'No'}
              </div>
            </CardContent>
          </Card>

          {/* Test 4: QuestionOptions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Test 4: QuestionOptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuestionOptions
                options={testOptions}
                selectedAnswer={selectedAnswer4}
                correctAnswer={correctAnswer}
                showResult={showResult4}
                onAnswerSelect={setSelectedAnswer4}
              />
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowResult4(true)}
                  disabled={selectedAnswer4 === null || showResult4}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Submit
                </Button>
                <Button 
                  onClick={() => {
                    setSelectedAnswer4(null);
                    setShowResult4(false);
                  }}
                  variant="outline"
                  className="border-gray-600 text-white"
                >
                  Reset
                </Button>
              </div>
              <div className="text-sm text-gray-400">
                Selected: {selectedAnswer4 !== null ? testOptions[selectedAnswer4] : 'None'} | 
                Show Result: {showResult4 ? 'Yes' : 'No'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Test Status */}
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-white font-semibold">StableQuizOptions</div>
                <div className={selectedAnswer1 !== null ? 'text-green-400' : 'text-red-400'}>
                  {selectedAnswer1 !== null ? '✓ Working' : '✗ No Selection'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">QuestionAnswerOptions</div>
                <div className={selectedAnswer2 !== null ? 'text-green-400' : 'text-red-400'}>
                  {selectedAnswer2 !== null ? '✓ Working' : '✗ No Selection'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">SimplifiedQuestionDisplay</div>
                <div className={selectedAnswer3 !== null ? 'text-green-400' : 'text-red-400'}>
                  {selectedAnswer3 !== null ? '✓ Working' : '✗ No Selection'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">QuestionOptions</div>
                <div className={selectedAnswer4 !== null ? 'text-green-400' : 'text-red-400'}>
                  {selectedAnswer4 !== null ? '✓ Working' : '✗ No Selection'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ButtonTestingComponent;
