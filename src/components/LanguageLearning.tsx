import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Star, Trophy, Volume2, RotateCcw } from "lucide-react";

interface LanguageLearningProps {
  initialLanguage?: string;
}

const LanguageLearning = ({ initialLanguage }: LanguageLearningProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage || "spanish");
  const [currentLesson, setCurrentLesson] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState(3);
  const [xp, setXp] = useState(1250);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Update selectedLanguage when initialLanguage changes
  useEffect(() => {
    if (initialLanguage) {
      setSelectedLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  const languages = [
    { code: "spanish", name: "Spanish", flag: "🇪🇸", color: "bg-red-500" },
    { code: "french", name: "French", flag: "🇫🇷", color: "bg-blue-600" },
    { code: "german", name: "German", flag: "🇩🇪", color: "bg-yellow-500" },
    { code: "italian", name: "Italian", flag: "🇮🇹", color: "bg-green-500" },
    { code: "portuguese", name: "Portuguese", flag: "🇵🇹", color: "bg-green-600" },
    { code: "mandarin", name: "Mandarin", flag: "🇨🇳", color: "bg-red-600" },
    { code: "japanese", name: "Japanese", flag: "🇯🇵", color: "bg-red-400" }
  ];

  const lessons = {
    spanish: [
      {
        title: "Basic Greetings",
        questions: [
          {
            type: "translate",
            question: "Translate to Spanish: 'Hello, how are you?'",
            options: ["Hola, ¿cómo estás?", "Buenos días", "Adiós", "Gracias"],
            correct: 0,
            audio: "Hola, ¿cómo estás?"
          },
          {
            type: "multiple",
            question: "What does 'Buenos días' mean?",
            options: ["Good evening", "Good morning", "Good night", "Goodbye"],
            correct: 1
          },
          {
            type: "fill",
            question: "Fill in: 'Mucho ___' (Nice to meet you)",
            options: ["gusto", "gracias", "bueno", "hola"],
            correct: 0
          }
        ]
      }
    ],
    french: [
      {
        title: "Basic Greetings",
        questions: [
          {
            type: "translate",
            question: "Translate to French: 'Hello, how are you?'",
            options: ["Bonjour, comment allez-vous?", "Au revoir", "Merci beaucoup", "Bonne nuit"],
            correct: 0,
            audio: "Bonjour, comment allez-vous?"
          },
          {
            type: "multiple",
            question: "What does 'Bonjour' mean?",
            options: ["Good evening", "Good morning/Hello", "Good night", "Goodbye"],
            correct: 1
          }
        ]
      }
    ],
    german: [
      {
        title: "Basic Greetings",
        questions: [
          {
            type: "translate",
            question: "Translate to German: 'Hello, how are you?'",
            options: ["Hallo, wie geht es dir?", "Guten Tag", "Auf Wiedersehen", "Danke schön"],
            correct: 0,
            audio: "Hallo, wie geht es dir?"
          },
          {
            type: "multiple",
            question: "What does 'Guten Morgen' mean?",
            options: ["Good evening", "Good morning", "Good night", "Good day"],
            correct: 1
          }
        ]
      }
    ],
    italian: [
      {
        title: "Basic Greetings",
        questions: [
          {
            type: "translate",
            question: "Translate to Italian: 'Hello, how are you?'",
            options: ["Ciao, come stai?", "Arrivederci", "Grazie", "Buonanotte"],
            correct: 0,
            audio: "Ciao, come stai?"
          },
          {
            type: "multiple",
            question: "What does 'Buongiorno' mean?",
            options: ["Good evening", "Good morning", "Good night", "Goodbye"],
            correct: 1
          }
        ]
      }
    ],
    mandarin: [
      {
        title: "Basic Greetings",
        questions: [
          {
            type: "translate",
            question: "Translate to Mandarin: 'Hello, how are you?'",
            options: ["你好，你好吗？", "再见", "谢谢", "晚安"],
            correct: 0,
            audio: "你好，你好吗？"
          },
          {
            type: "multiple",
            question: "What does '你好' mean?",
            options: ["Goodbye", "Hello", "Thank you", "Excuse me"],
            correct: 1
          }
        ]
      }
    ]
  };

  const currentLessonData = lessons[selectedLanguage as keyof typeof lessons]?.[currentLesson];
  const currentQuestionData = currentLessonData?.questions[currentQuestion];
  const progressPercent = currentLessonData ? ((currentQuestion + 1) / currentLessonData.questions.length) * 100 : 0;

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'spanish' ? 'es-ES' : 
                      selectedLanguage === 'french' ? 'fr-FR' :
                      selectedLanguage === 'german' ? 'de-DE' :
                      selectedLanguage === 'italian' ? 'it-IT' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex.toString());
  };

  const checkAnswer = () => {
    if (!currentQuestionData) return;
    
    const correct = parseInt(selectedAnswer) === currentQuestionData.correct;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setXp(prev => prev + 10);
      if (currentQuestionData.audio) {
        setTimeout(() => playAudio(currentQuestionData.audio!), 500);
      }
    } else {
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const nextQuestion = () => {
    if (!currentLessonData) return;
    
    if (currentQuestion < currentLessonData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Lesson completed
      setCurrentLesson(prev => prev + 1);
      setCurrentQuestion(0);
      setStreak(prev => prev + 1);
      setXp(prev => prev + 50);
    }
    
    setSelectedAnswer("");
    setShowResult(false);
    setIsCorrect(false);
  };

  const resetLesson = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {!currentLessonData ? (
        // Language and lesson selection
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span className="flex items-center space-x-2">
                  <span className="text-2xl">🌍</span>
                  <span>Language Learning - Duolingo Style</span>
                </span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-white">{hearts}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-white">{streak} day streak</span>
                  </div>
                  <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400">
                    {xp} XP
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant="outline"
                    className={`h-20 bg-gray-800 border-gray-600 hover:bg-gray-700 text-white flex flex-col space-y-2 ${
                      selectedLanguage === lang.code ? 'ring-2 ring-purple-400' : ''
                    }`}
                    onClick={() => setSelectedLanguage(lang.code)}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedLanguage && lessons[selectedLanguage as keyof typeof lessons] && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Lessons in {languages.find(l => l.code === selectedLanguage)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lessons[selectedLanguage as keyof typeof lessons].map((lesson, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full h-16 bg-gray-700 border-gray-600 hover:bg-gray-600 text-white justify-between"
                      onClick={() => setCurrentLesson(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                        <span>{lesson.title}</span>
                      </div>
                      <Star className="w-5 h-5 text-yellow-500" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        // Lesson interface
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentLesson(-1)}
                  className="text-gray-400 hover:text-white"
                >
                  ← Back
                </Button>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-white">{hearts}</span>
                  </div>
                  <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400">
                    {xp} XP
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-white">
                  <span>{currentLessonData.title}</span>
                  <span>{currentQuestion + 1} / {currentLessonData.questions.length}</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </CardHeader>
          </Card>

          {currentQuestionData && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {currentQuestionData.question}
                    </h3>
                    {currentQuestionData.audio && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playAudio(currentQuestionData.audio!)}
                        className="text-gray-300 border-gray-600 hover:bg-gray-700"
                      >
                        <Volume2 className="w-4 h-4 mr-2" />
                        Listen
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-3">
                    {currentQuestionData.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`h-12 text-left justify-start ${
                          selectedAnswer === index.toString()
                            ? showResult
                              ? isCorrect && parseInt(selectedAnswer) === index
                                ? 'bg-green-600 border-green-500 text-white'
                                : parseInt(selectedAnswer) === index
                                ? 'bg-red-600 border-red-500 text-white'
                                : currentQuestionData.correct === index
                                ? 'bg-green-600 border-green-500 text-white'
                                : 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-blue-600 border-blue-500 text-white'
                            : showResult && currentQuestionData.correct === index
                            ? 'bg-green-600 border-green-500 text-white'
                            : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                        }`}
                        onClick={() => !showResult && handleAnswerSelect(index)}
                        disabled={showResult}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>

                  {!showResult ? (
                    <Button
                      onClick={checkAnswer}
                      disabled={!selectedAnswer}
                      className="w-full bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                    >
                      Check Answer
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className={`text-center p-4 rounded-lg ${
                        isCorrect ? 'bg-green-600/20 border border-green-500' : 'bg-red-600/20 border border-red-500'
                      }`}>
                        <div className="text-2xl mb-2">
                          {isCorrect ? '🎉' : '😔'}
                        </div>
                        <p className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again next time!'}
                        </p>
                        {isCorrect && <p className="text-white text-sm mt-2">+10 XP</p>}
                      </div>
                      <Button
                        onClick={nextQuestion}
                        className="w-full bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                      >
                        {currentQuestion < currentLessonData.questions.length - 1 ? 'Next' : 'Complete Lesson'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageLearning;
