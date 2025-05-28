import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Star, Trophy, Volume2, RotateCcw } from "lucide-react";

const LanguageLearning = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("engelsk");
  const [currentLesson, setCurrentLesson] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState(3);
  const [xp, setXp] = useState(1250);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const languages = [
    { code: "engelsk", name: "Engelsk", flag: "🇬🇧", color: "bg-blue-500" },
    { code: "tysk", name: "Tysk", flag: "🇩🇪", color: "bg-red-500" },
    { code: "fransk", name: "Fransk", flag: "🇫🇷", color: "bg-blue-600" },
    { code: "spansk", name: "Spansk", flag: "🇪🇸", color: "bg-yellow-500" },
    { code: "kinesisk", name: "Kinesisk", flag: "🇨🇳", color: "bg-red-600" },
    { code: "svensk", name: "Svensk", flag: "🇸🇪", color: "bg-blue-400" },
    { code: "norsk", name: "Norsk", flag: "🇳🇴", color: "bg-red-600" }
  ];

  const lessons = {
    engelsk: [
      {
        title: "Grundlæggende hilsner",
        questions: [
          {
            type: "translate",
            question: "Oversæt til engelsk: 'Hej, hvordan har du det?'",
            options: ["Hello, how are you?", "Hi, what's up?", "Good morning, sir", "Nice to meet you"],
            correct: 0,
            audio: "Hello, how are you?"
          },
          {
            type: "multiple",
            question: "Hvad betyder 'Good morning'?",
            options: ["God aften", "God morgen", "God nat", "God dag"],
            correct: 1
          },
          {
            type: "fill",
            question: "Udfyld: 'Nice to ___ you!'",
            options: ["see", "meet", "find", "know"],
            correct: 1
          }
        ]
      },
      {
        title: "Farver og tal",
        questions: [
          {
            type: "translate",
            question: "Oversæt til engelsk: 'Det røde hus'",
            options: ["The red house", "A red home", "The blue house", "Red building"],
            correct: 0
          },
          {
            type: "multiple",
            question: "Hvilket tal er 'fifteen'?",
            options: ["14", "15", "16", "50"],
            correct: 1
          }
        ]
      }
    ],
    tysk: [
      {
        title: "Grundlæggende hilsner",
        questions: [
          {
            type: "translate",
            question: "Oversæt til tysk: 'Hej, hvordan har du det?'",
            options: ["Hallo, wie geht es dir?", "Guten Tag", "Auf Wiedersehen", "Danke schön"],
            correct: 0,
            audio: "Hallo, wie geht es dir?"
          },
          {
            type: "multiple",
            question: "Hvad betyder 'Guten Morgen'?",
            options: ["God aften", "God morgen", "God nat", "God dag"],
            correct: 1
          }
        ]
      }
    ],
    fransk: [
      {
        title: "Grundlæggende hilsner",
        questions: [
          {
            type: "translate",
            question: "Oversæt til fransk: 'Hej, hvordan har du det?'",
            options: ["Bonjour, comment allez-vous?", "Au revoir", "Merci beaucoup", "Bonne nuit"],
            correct: 0,
            audio: "Bonjour, comment allez-vous?"
          },
          {
            type: "multiple",
            question: "Hvad betyder 'Bonjour'?",
            options: ["God aften", "God morgen", "God nat", "Farvel"],
            correct: 1
          }
        ]
      }
    ],
    spansk: [
      {
        title: "Grundlæggende hilsner",
        questions: [
          {
            type: "translate",
            question: "Oversæt til spansk: 'Hej, hvordan har du det?'",
            options: ["Hola, ¿cómo estás?", "Adiós", "Gracias", "Buenas noches"],
            correct: 0,
            audio: "Hola, ¿cómo estás?"
          },
          {
            type: "multiple",
            question: "Hvad betyder 'Buenos días'?",
            options: ["God aften", "God morgen", "God nat", "Farvel"],
            correct: 1
          }
        ]
      }
    ],
    kinesisk: [
      {
        title: "Grundlæggende hilsner",
        questions: [
          {
            type: "translate",
            question: "Oversæt til kinesisk: 'Hej, hvordan har du det?'",
            options: ["你好，你好吗？", "再见", "谢谢", "晚安"],
            correct: 0,
            audio: "你好，你好吗？"
          },
          {
            type: "multiple",
            question: "Hvad betyder '你好'?",
            options: ["Farvel", "Hej/Hallo", "Tak", "Undskyld"],
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
      utterance.lang = selectedLanguage === 'engelsk' ? 'en-US' : 'da-DK';
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
                  <span>Sprogtræning - Duolingo stil</span>
                </span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-white">{hearts}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-white">{streak} dages streak</span>
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
                  Lektioner i {languages.find(l => l.code === selectedLanguage)?.name}
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
                  ← Tilbage
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
                        Lyt
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
                      Tjek svar
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
                          {isCorrect ? 'Rigtigt! Godt klaret!' : 'Forkert. Prøv igen næste gang!'}
                        </p>
                        {isCorrect && <p className="text-white text-sm mt-2">+10 XP</p>}
                      </div>
                      <Button
                        onClick={nextQuestion}
                        className="w-full bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                      >
                        {currentQuestion < currentLessonData.questions.length - 1 ? 'Næste' : 'Afslut lektion'}
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
