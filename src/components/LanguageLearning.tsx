
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelectionView from "./language-learning/LanguageSelectionView";
import LessonView from "./language-learning/LessonView";
import { Language, LanguageLessons, LanguageLearningProps } from "./language-learning/types";

const LanguageLearning = ({ initialLanguage }: LanguageLearningProps) => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage || "spanish");
  const [currentLesson, setCurrentLesson] = useState(-1);
  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState(3);
  const [xp, setXp] = useState(1250);

  // Update selectedLanguage when initialLanguage changes
  useEffect(() => {
    if (initialLanguage) {
      setSelectedLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  const languages: Language[] = [
    { code: "spanish", name: "Spanish", flag: "🇪🇸", color: "bg-red-500" },
    { code: "french", name: "French", flag: "🇫🇷", color: "bg-blue-600" },
    { code: "german", name: "German", flag: "🇩🇪", color: "bg-yellow-500" },
    { code: "italian", name: "Italian", flag: "🇮🇹", color: "bg-green-500" },
    { code: "portuguese", name: "Portuguese", flag: "🇵🇹", color: "bg-green-600" },
    { code: "mandarin", name: "Mandarin", flag: "🇨🇳", color: "bg-red-600" },
    { code: "japanese", name: "Japanese", flag: "🇯🇵", color: "bg-red-400" }
  ];

  const lessons: LanguageLessons = {
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

  const currentLessonData = currentLesson >= 0 ? lessons[selectedLanguage]?.[currentLesson] : null;

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleLessonSelect = (lessonIndex: number) => {
    setCurrentLesson(lessonIndex);
  };

  const handleBackToSelection = () => {
    setCurrentLesson(-1);
  };

  const handleBackToProgram = () => {
    navigate('/daily-program');
  };

  const handleLessonComplete = () => {
    setCurrentLesson(-1);
    setStreak(prev => prev + 1);
    setXp(prev => prev + 50);
  };

  const handleHeartLost = () => {
    setHearts(prev => Math.max(0, prev - 1));
  };

  const handleXpGained = (amount: number) => {
    setXp(prev => prev + amount);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {!currentLessonData ? (
        <LanguageSelectionView
          languages={languages}
          selectedLanguage={selectedLanguage}
          lessons={lessons}
          hearts={hearts}
          streak={streak}
          xp={xp}
          onLanguageSelect={handleLanguageSelect}
          onLessonSelect={handleLessonSelect}
          onBack={handleBackToProgram}
        />
      ) : (
        <div className="bg-gray-900 min-h-screen">
          <LessonView
            currentLesson={currentLessonData}
            selectedLanguage={selectedLanguage}
            hearts={hearts}
            xp={xp}
            onBack={handleBackToSelection}
            onLessonComplete={handleLessonComplete}
            onHeartLost={handleHeartLost}
            onXpGained={handleXpGained}
          />
        </div>
      )}
    </div>
  );
};

export default LanguageLearning;
