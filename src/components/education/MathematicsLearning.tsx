
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calculator, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MathematicsLearning = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: "What is 1/2 + 1/4?",
      options: ["1/6", "2/6", "3/4", "1/3"],
      correct: 2,
      explanation: "1/2 + 1/4 = 2/4 + 1/4 = 3/4"
    },
    {
      question: "What is the area of a rectangle with length 5 and width 3?",
      options: ["8", "15", "10", "12"],
      correct: 1,
      explanation: "Area = length × width = 5 × 3 = 15"
    },
    {
      question: "Solve: 2x + 4 = 10",
      options: ["x = 2", "x = 3", "x = 4", "x = 6"],
      correct: 1,
      explanation: "2x + 4 = 10, so 2x = 6, therefore x = 3"
    }
  ];

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    const isCorrect = selectedAnswer === currentQuestionData.correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Lesson complete
      navigate('/daily-program');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/daily-program')}
            className="border-gray-600 text-white bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Button>
          <div className="text-lg font-semibold">
            Score: {score}/{questions.length}
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Calculator className="w-5 h-5 text-blue-400" />
              <span>Mathematics - Fractions & Geometry</span>
            </CardTitle>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </CardHeader>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-white">
              {currentQuestionData.question}
            </h3>

            <div className="space-y-3 mb-6">
              {currentQuestionData.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full text-left justify-start p-4 h-auto ${
                    selectedAnswer === index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  }`}
                  onClick={() => !showResult && handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="mr-3 font-semibold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className={`w-5 h-5 mr-2 ${
                    selectedAnswer === currentQuestionData.correct 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`} />
                  <span className={selectedAnswer === currentQuestionData.correct 
                    ? 'text-green-400 font-semibold' 
                    : 'text-red-400 font-semibold'
                  }>
                    {selectedAnswer === currentQuestionData.correct ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-gray-300">{currentQuestionData.explanation}</p>
              </div>
            )}

            <div className="flex justify-end">
              {!showResult ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Lesson'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MathematicsLearning;
