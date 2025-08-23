import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { invokeFn } from '@/supabase/functionsClient';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { Volume2 } from 'lucide-react';
import type { AdaptiveContentRes } from '@/types/api';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const SimpleMathematicsLearningPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { speakText, isReady } = useUnifiedSpeech();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);

  // Text-to-speech helper
  const handleSpeak = (text: string) => {
    if (isReady) {
      speakText(text);
    }
  };

  // Generate initial 2 questions for fast start
  const generateInitialQuestions = async () => {
    setIsGenerating(true);
    console.log('📚 NELIE: Starting initial question generation (2 questions)...');
    
    try {
      const generatedQuestions: Question[] = [];
      
      // Generate only 2 questions initially for fast start
      for (let i = 0; i < 2; i++) {
        console.log(`📚 NELIE: Generating initial question ${i + 1} of 2...`);
        
        const data = await invokeFn<AdaptiveContentRes>('generate-adaptive-content', {
          subject: 'mathematics',
          skillArea: 'general',
          gradeLevel: 3,
          userId: 'student'
        });

        if (data?.question) {
          const aiQuestion: Question = {
            question: data.question,
            options: data.options || ['A', 'B', 'C', 'D'],
            correct: data.correct || 0,
            explanation: data.explanation || 'Great job!'
          };
          
          generatedQuestions.push(aiQuestion);
          console.log(`✅ NELIE: Generated initial question ${i + 1}: ${aiQuestion.question.substring(0, 50)}...`);
        } else {
          throw new Error(`No question data received for question ${i + 1}`);
        }
      }
      
      setQuestions(generatedQuestions);
      console.log(`🎉 NELIE: Successfully generated ${generatedQuestions.length} initial math questions!`);
      
      // Start generating more questions in the background
      generateMoreQuestions();
      
    } catch (error) {
      console.error('❌ NELIE: Failed to generate initial questions:', error);
      toast({
        title: "NELIE Generation Failed",
        description: "Using fallback questions for now",
        variant: "destructive"
      });
      
      // Fallback to ensure the lesson can still work
      setQuestions([
        {
          question: "What is 15 + 27?",
          options: ["40", "41", "42", "43"],
          correct: 2,
          explanation: "15 + 27 = 42"
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate additional questions in the background
  const generateMoreQuestions = async () => {
    setIsGeneratingMore(true);
    console.log('📚 NELIE: Generating additional questions in background...');
    
    try {
      const additionalQuestions: Question[] = [];
      
      // Generate 3 more questions to reach 5 total
      for (let i = 2; i < 5; i++) {
        console.log(`📚 NELIE: Generating background question ${i + 1} of 5...`);
        
        const data = await invokeFn<AdaptiveContentRes>('generate-adaptive-content', {
          subject: 'mathematics',
          skillArea: 'general',
          gradeLevel: 3,
          userId: 'student'
        });

        if (data?.question) {
          const aiQuestion: Question = {
            question: data.question,
            options: data.options || ['A', 'B', 'C', 'D'],
            correct: data.correct || 0,
            explanation: data.explanation || 'Great job!'
          };
          
          additionalQuestions.push(aiQuestion);
          console.log(`✅ NELIE: Generated background question ${i + 1}: ${aiQuestion.question.substring(0, 50)}...`);
        }
      }
      
      // Add new questions to existing ones
      setQuestions(prev => [...prev, ...additionalQuestions]);
      console.log(`🎉 NELIE: Successfully generated ${additionalQuestions.length} additional math questions!`);
      
    } catch (error) {
      console.error('❌ NELIE: Failed to generate additional questions:', error);
    } finally {
      setIsGeneratingMore(false);
    }
  };

  useEffect(() => {
    if (hasStarted && questions.length === 0) {
      generateInitialQuestions();
    }
  }, [hasStarted]);

  useEffect(() => {
    if (hasStarted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [hasStarted]);

  const handleBackToTraining = () => {
    navigate('/training-ground');
  };

  const handleStartLearning = () => {
    setHasStarted(true);
    handleSpeak("Welcome to your mathematics lesson! Let's start with some questions.");
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || questions.length === 0 || !questions[currentQuestion]) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      handleSpeak("Excellent! That's correct.");
    } else {
      setStreak(0);
      handleSpeak("Not quite right, but keep trying!");
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      handleSpeak("Let's move on to the next question.");
    } else {
      handleSpeak(`Congratulations! You completed ${questions.length} questions with ${score} points!`);
      navigate('/training-ground');
    }
  };

  const timeInMinutes = Math.floor(timeElapsed / 60);
  const timeInSeconds = timeElapsed % 60;
  const progressPercentage = hasStarted && questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 relative">
      {/* NELIE Floating Robot */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full p-4 shadow-2xl border-4 border-blue-300 animate-bounce">
          <div className="text-4xl">🤖</div>
        </div>
        <div className="text-center mt-2">
          <span className="text-white text-sm font-bold bg-blue-600 px-2 py-1 rounded">NELIE</span>
        </div>
      </div>

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

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">🤖 NELIE Mathematics Learning</h1>
            <div
              onClick={() => handleSpeak("Welcome to your mathematics lesson! I'm NELIE, your virtual robot teacher.")}
              className="text-blue-300 hover:text-blue-100 transition-colors cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Read welcome message aloud"
            >
              <Volume2 className="w-6 h-6" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{hasStarted ? currentQuestion + 1 : 1}</div>
              <div className="text-gray-400">Question</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{questions.length}</div>
              <div className="text-gray-400">Total Questions</div>
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
          <div className="bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg relative">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-white text-xl font-bold">🤖 Mathematics Questions</h2>
                <div
                  onClick={() => handleSpeak("Start with 2 questions that load instantly, then more questions generate in the background!")}
                  className="text-purple-200 hover:text-white transition-colors cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Read lesson description aloud"
                >
                  <Volume2 className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-300 text-lg">
                  Start with 2 questions that load instantly, then more questions generate in the background!
                </p>
                <div
                  onClick={() => handleSpeak("Start with 2 questions that load instantly, then more questions generate in the background!")}
                  className="text-purple-300 hover:text-purple-100 transition-colors absolute top-2 right-2 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Read lesson description aloud"
                >
                  <Volume2 className="w-5 h-5" />
                </div>
              </div>
              <button
                onClick={handleStartLearning}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🚀 START LEARNING with NELIE!
              </button>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg">
            <div className="bg-gradient-to-r from-orange-600 to-yellow-600 p-4 rounded-t-lg">
              <h2 className="text-white text-xl font-bold">🤖 NELIE is Generating Questions...</h2>
            </div>
            <div className="p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-300 text-lg">
                NELIE is creating your first 2 questions...
              </p>
            </div>
          </div>
        ) : questions.length > 0 && questions[currentQuestion] ? (
          <div className="bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-white text-xl font-bold">Question {currentQuestion + 1} of {questions.length}</h2>
                <div
                  onClick={() => handleSpeak(`Question ${currentQuestion + 1} of ${questions.length}`)}
                  className="text-green-200 hover:text-white transition-colors cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Read question aloud"
                >
                  <Volume2 className="w-5 h-5" />
                </div>
              </div>
              {isGeneratingMore && (
                <p className="text-sm text-blue-200 mt-1">🤖 NELIE is generating more questions in background...</p>
              )}
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg relative">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg text-white mb-6 leading-relaxed flex-1 pr-4">
                    {questions[currentQuestion].question}
                  </h3>
                  <div
                    onClick={() => handleSpeak(questions[currentQuestion].question)}
                    className="text-blue-300 hover:text-blue-100 transition-colors mt-1 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label="Read question aloud"
                  >
                    <Volume2 className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="grid gap-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`p-4 text-left border rounded-lg text-base transition-all relative ${
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
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="mr-4 font-bold text-lg">{String.fromCharCode(65 + index)}.</span>
                          {option}
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(`Option ${String.fromCharCode(65 + index)}: ${option}`);
                        }}
                        className="text-gray-400 hover:text-white transition-colors ml-2 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        aria-label={`Read option ${String.fromCharCode(65 + index)} aloud`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </div>
                      </div>
                    </button>
                  ))}
                </div>

                {showResult && (
                  <div className="mt-6 p-4 bg-green-900/50 rounded-lg border border-green-700 relative">
                    <div className="flex items-start justify-between">
                      <p className="text-green-200 mb-4 text-base flex-1 pr-4">
                        {questions[currentQuestion].explanation}
                      </p>
                      <div
                        onClick={() => handleSpeak(questions[currentQuestion].explanation)}
                        className="text-green-300 hover:text-green-100 transition-colors cursor-pointer"
                        role="button"
                        tabIndex={0}
                        aria-label="Read explanation aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </div>
                    </div>
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
        ) : (
          <div className="bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 rounded-t-lg">
              <h2 className="text-white text-xl font-bold">⚠️ No Questions Available</h2>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-300 text-lg mb-4">
                No questions are currently available. Please try starting the lesson again.
              </p>
              <button
                onClick={() => {
                  setHasStarted(false);
                  setQuestions([]);
                  setCurrentQuestion(0);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🔄 Restart Lesson
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleMathematicsLearningPage;