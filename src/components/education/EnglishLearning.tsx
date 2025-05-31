
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowLeft, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EnglishLearning = () => {
  const navigate = useNavigate();
  const [currentActivity, setCurrentActivity] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const activities = [
    {
      type: "reading",
      title: "Read and Understand",
      content: "The cat sat on the mat. It was a sunny day and the cat was happy.",
      question: "How was the cat feeling?",
      options: ["Sad", "Happy", "Angry", "Tired"],
      correct: 1
    },
    {
      type: "spelling",
      title: "Complete the Word",
      content: "Fill in the missing letters:",
      question: "Beauti_ul",
      options: ["f", "v", "w", "k"],
      correct: 0
    },
    {
      type: "vocabulary",
      title: "Word Meaning",
      content: "What does 'enormous' mean?",
      question: "Choose the correct meaning:",
      options: ["Very small", "Very big", "Very fast", "Very slow"],
      correct: 1
    }
  ];

  const currentActivityData = activities[currentActivity];
  const progress = ((currentActivity + 1) / activities.length) * 100;

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex.toString());
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentActivity < activities.length - 1) {
      setCurrentActivity(currentActivity + 1);
      setSelectedAnswer("");
      setShowResult(false);
    } else {
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
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <BookOpen className="w-5 h-5 text-green-400" />
              <span>English - Reading & Spelling</span>
            </CardTitle>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-400">
              Activity {currentActivity + 1} of {activities.length}
            </p>
          </CardHeader>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                {currentActivityData.title}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => playAudio(currentActivityData.content)}
                className="border-gray-600 text-white bg-gray-700 hover:bg-gray-600"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-6">
              <p className="text-gray-200 text-lg leading-relaxed">
                {currentActivityData.content}
              </p>
            </div>

            <h4 className="text-lg font-medium mb-4 text-white">
              {currentActivityData.question}
            </h4>

            <div className="space-y-3 mb-6">
              {currentActivityData.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index.toString() ? "default" : "outline"}
                  className={`w-full text-left justify-start p-4 h-auto ${
                    selectedAnswer === index.toString()
                      ? "bg-green-500 text-white"
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
                <p className={`font-semibold ${
                  parseInt(selectedAnswer) === currentActivityData.correct 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {parseInt(selectedAnswer) === currentActivityData.correct ? 'Excellent!' : 'Try again next time!'}
                </p>
                <p className="text-gray-300 mt-2">
                  The correct answer is: {currentActivityData.options[currentActivityData.correct]}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              {!showResult ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === ""}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {currentActivity < activities.length - 1 ? 'Next Activity' : 'Complete Lesson'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnglishLearning;
