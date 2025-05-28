import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import LanguageLearning from "./LanguageLearning";
import SubjectSelector from "./ai-tutor/SubjectSelector";
import ChatMessage from "./ai-tutor/ChatMessage";
import LearningOptions from "./ai-tutor/LearningOptions";
import ChatInput from "./ai-tutor/ChatInput";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  showOptions?: boolean;
}

const AITutor = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant" as const,
      content: user ? `Hej ${user.user_metadata?.name || 'Elev'}! Dette er hvad vi vil arbejde på i dag. Hvor vil du gerne begynde? 🇩🇰` : "Hej! Jeg er din AI-lærer. Hvad vil du gerne lære i dag? 🇩🇰",
      timestamp: new Date(),
      showOptions: user ? true : false
    }
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSubject, setCurrentSubject] = useState("matematik");
  const [showLanguageLearning, setShowLanguageLearning] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const messagesEndRef = useRef(null);

  const languages = [
    { code: "engelsk", name: "Engelsk", flag: "🇬🇧", color: "bg-blue-500" },
    { code: "tysk", name: "Tysk", flag: "🇩🇪", color: "bg-red-500" },
    { code: "fransk", name: "Fransk", flag: "🇫🇷", color: "bg-blue-600" },
    { code: "spansk", name: "Spansk", flag: "🇪🇸", color: "bg-yellow-500" },
    { code: "kinesisk", name: "Kinesisk", flag: "🇨🇳", color: "bg-red-600" },
    { code: "svensk", name: "Svensk", flag: "🇸🇪", color: "bg-blue-400" },
    { code: "norsk", name: "Norsk", flag: "🇳🇴", color: "bg-red-600" }
  ];

  const predefinedResponses = {
    matematik: [
      "Fantastisk! Lad os arbejde med brøker. Kan du fortælle mig hvad 1/2 + 1/4 er?",
      "Wow, du er god til geometri! Vil du prøve en udfordring med trekanter?",
      "Lad os øve multiplikation. Hvad er 7 × 8? Tag din tid!"
    ],
    dansk: [
      "Perfekt! Lad os øve stavning. Kan du stave ordet 'smørrebrød'?",
      "Godt valg! Vil du skrive en kort historie om en viking?",
      "Lad os læse sammen. Kender du H.C. Andersen eventyr?"
    ],
    engelsk: [
      "Great! Let's practice English. Can you tell me about your favorite Danish food in English?",
      "Wonderful! What's your favorite color in English?",
      "Let's learn new words! Do you know what 'hygge' means in English?"
    ],
    sprog: [
      "Fantastisk! Vil du prøve vores interaktive sprogtræning? Det ligner Duolingo og gør det sjovt at lære nye sprog!",
      "Perfekt valg! Hvilke sprog vil du gerne lære? Vi har engelsk, tysk, fransk og mange flere!",
      "Lad os begynde sprogtræning! Du kan vælge mellem forskellige sprog og øvelser."
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      role: "user" as const,
      content: message,
      timestamp: new Date(),
      showOptions: false
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const responses = predefinedResponses[currentSubject] || predefinedResponses.matematik;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiResponse: Message = {
        role: "assistant" as const,
        content: randomResponse,
        timestamp: new Date(),
        showOptions: false
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      if ('speechSynthesis' in window) {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(randomResponse);
        utterance.lang = 'da-DK';
        utterance.rate = 0.8;
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    }, 1000);
  };

  const handleLearningOption = (option) => {
    if (option.id === "language") {
      setShowLanguageSelection(true);
      return;
    }

    const optionMessage: Message = {
      role: "user" as const,
      content: `Jeg vil gerne ${option.title.toLowerCase()}`,
      timestamp: new Date(),
      showOptions: false
    };

    setMessages(prev => [...prev, optionMessage]);

    setTimeout(() => {
      let response = "";
      switch (option.id) {
        case "review":
          response = "Perfekt! Lad os gennemgå hvad du lærte om brøker i går. Husker du hvordan man lægger brøker sammen?";
          break;
        case "new":
          response = "Spændende! I dag vil jeg gerne lære dig om decimaler. Ved du hvad en decimal er?";
          break;
        case "practice":
          response = "Smart valg! Lad os øve multiplikation. Jeg giver dig nogle opgaver at løse.";
          break;
        case "test":
          response = "Fedt! Jeg har lavet en lille quiz til dig. Første spørgsmål: Hvad er 8 × 7?";
          break;
        default:
          response = "Lad os komme i gang med at lære!";
      }

      const aiResponse: Message = {
        role: "assistant" as const,
        content: response,
        timestamp: new Date(),
        showOptions: false
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setShowLanguageSelection(false);
    setShowLanguageLearning(true);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (showLanguageSelection) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={() => setShowLanguageSelection(false)}
          className="text-white border-gray-600 hover:bg-gray-700"
        >
          ← Tilbage til AI Lærer
        </Button>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-center">
              <span className="flex items-center justify-center space-x-2">
                <span className="text-2xl">🌍</span>
                <span>Vælg dit sprog</span>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-center mb-6">
              Hvilket sprog vil du gerne lære i dag?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant="outline"
                  className="h-24 bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-purple-400 text-white flex flex-col space-y-2 group"
                  onClick={() => handleLanguageSelect(lang.code)}
                >
                  <span className="text-3xl">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showLanguageLearning) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => {
            setShowLanguageLearning(false);
            setSelectedLanguage("");
          }}
          className="text-white border-gray-600 hover:bg-gray-700"
        >
          ← Tilbage til AI Lærer
        </Button>
        <LanguageLearning initialLanguage={selectedLanguage} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2 text-white">
              <span className="text-2xl">🎓</span>
              <span>AI Lærer - Din Personlige Athena</span>
            </span>
            <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400">
              GPT-4o + ElevenLabs Dansk
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SubjectSelector
            currentSubject={currentSubject}
            onSubjectChange={setCurrentSubject}
            onLanguageSelect={() => setShowLanguageSelection(true)}
          />
        </CardContent>
      </Card>

      <Card className="h-96 bg-gray-900 border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white">Chat med din AI lærer</CardTitle>
        </CardHeader>
        <CardContent className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message}>
                {message.showOptions && (
                  <LearningOptions onOptionSelect={handleLearningOption} />
                )}
              </ChatMessage>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            isSpeaking={isSpeaking}
            onStopSpeaking={stopSpeaking}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AITutor;
