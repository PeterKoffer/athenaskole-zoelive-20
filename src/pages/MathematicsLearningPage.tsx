import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

console.log('🔥 DEBUGGING: MathematicsLearningPage loaded');

const MathematicsLearningPage = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(29);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  console.log('🔥 DEBUGGING: Component state:', { currentQuestion, hasStarted, score });

  // Grade 3 math questions - REAL INTERACTIVE CONTENT
  const questions = [
    {
      question: "Emma has 24 stickers. She wants to share them equally among her 4 friends. How many stickers will each friend get?",
      options: ["5 stickers", "6 stickers", "7 stickers", "8 stickers"],
      correct: 1,
      explanation: "24 ÷ 4 = 6. Each friend gets 6 stickers!"
    },
    {
      question: "What is 15 + 27?",
      options: ["41", "42", "43", "44"],
      correct: 1,
      explanation: "15 + 27 = 42. Great addition!"
    },
    {
      question: "Jake has 3 boxes of crayons. Each box has 8 crayons. How many crayons does Jake have in total?",
      options: ["21", "22", "23", "24"],
      correct: 3,
      explanation: "3 × 8 = 24. Jake has 24 crayons!"
    }
  ];

  useEffect(() => {
    if (hasStarted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [hasStarted]);

  const handleBackToTraining = () => {
    console.log('🔥 DEBUGGING: Back to training clicked');
    navigate('/daily-program');
  };

  const handleStartLearning = () => {
    console.log('🔥 DEBUGGING: Start learning clicked');
    setHasStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    console.log('🔥 DEBUGGING: Answer selected:', answerIndex);
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    console.log('🔥 DEBUGGING: Next question clicked');
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      alert(`Congratulations! You completed the lesson with ${score} points!`);
      navigate('/daily-program');
    }
  };

  const timeInMinutes = Math.floor(timeElapsed / 60);
  const timeInSeconds = timeElapsed % 60;
  const progressPercentage = hasStarted ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToTraining}
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              ← Back to Training Ground
            </button>
            <div className="flex items-center text-white space-x-4">
              <span className="text-sm">⏱ 0:{timeInMinutes.toString().padStart(2, '0')}:{timeInSeconds.toString().padStart(2, '0')} / 20:00</span>
              <span className="text-sm">⭐ {score} points</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">🔥 DEBUG: Peter's Mathematics Session (WORKING!)</h1>
          
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{hasStarted ? currentQuestion + 1 : 1}</div>
              <div className="text-gray-400">Activity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{questions.length}</div>
              <div className="text-gray-400">Total Activities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{streak}</div>
              <div className="text-gray-400">Correct Streak</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-lime-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {!hasStarted ? (
          <div className="bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-lg">
              <h2 className="text-white text-xl font-bold">🔥 REAL Interactive Mathematics (NOT AI Generated!)</h2>
            </div>
            <div className="p-8">
              <p className="text-gray-300 text-lg mb-6">
                This is the NEW working mathematics content! Click below to start 3 interactive math questions with real feedback.
              </p>
              <button
                onClick={handleStartLearning}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🚀 START REAL MATH LEARNING
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-t-lg">
              <h2 className="text-white text-xl font-bold">Question {currentQuestion + 1} of {questions.length}</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg text-white mb-6 leading-relaxed">
                  {questions[currentQuestion].question}
                </h3>
                
                <div className="grid gap-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`p-4 text-left border rounded-lg text-base transition-all ${
                        showResult && index === questions[currentQuestion].correct
                          ? 'bg-green-600 border-green-500 text-white'
                          : showResult && selectedAnswer === index && index !== questions[currentQuestion].correct
                          ? 'bg-red-600 border-red-500 text-white'
                          : showResult
                          ? 'bg-gray-700 border-gray-600 text-gray-400'
                          : selectedAnswer === index
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                      }`}
                    >
                      <span className="mr-4 font-bold text-lg">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  ))}
                </div>

                {showResult && (
                  <div className="mt-6 p-4 bg-green-900/50 rounded-lg border border-green-700">
                    <p className="text-green-200 mb-4 text-base">
                      {questions[currentQuestion].explanation}
                    </p>
                    <button 
                      onClick={handleNext}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Complete Lesson ✨'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathematicsLearningPage;