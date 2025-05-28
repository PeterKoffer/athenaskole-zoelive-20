import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Send, Volume2, VolumeX, BookOpen, Calculator, Globe, Atom } from "lucide-react";
import LanguageLearning from "./LanguageLearning";

const AITutor = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: user ? `Hej ${user.user_metadata?.name || 'Elev'}! Dette er hvad vi vil arbejde på i dag. Hvor vil du gerne begynde? 🇩🇰` : "Hej! Jeg er din AI-lærer. Hvad vil du gerne lære i dag? 🇩🇰",
      timestamp: new Date(),
      showOptions: user ? true : false
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSubject, setCurrentSubject] = useState("matematik");
  const [showLanguageLearning, setShowLanguageLearning] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const subjects = [
    { id: "matematik", name: "Matematik", emoji: "🔢", icon: Calculator },
    { id: "dansk", name: "Dansk", emoji: "📝", icon: BookOpen },
    { id: "engelsk", name: "Engelsk", emoji: "🇬🇧", icon: Globe },
    { id: "sprog", name: "Sprog", emoji: "🌍", icon: Globe },
    { id: "naturteknik", name: "Natur & Teknik", emoji: "🧪", icon: Atom },
    { id: "historie", name: "Historie", emoji: "🏰", icon: BookOpen }
  ];

  const learningOptions = [
    { id: "review", title: "Gennemgå gårsdagens emner", description: "Lad os repetere hvad du lærte sidst", icon: "🔄" },
    { id: "new", title: "Lær noget nyt", description: "Udforsk nye emner og koncepter", icon: "✨" },
    { id: "practice", title: "Øv tidligere emner", description: "Styrk dine færdigheder med øvelser", icon: "💪" },
    { id: "test", title: "Tag en lille test", description: "Test din viden med sjove opgaver", icon: "🎯" },
    { id: "language", title: "Sprogtræning", description: "Lær nye sprog som Duolingo", icon: "🌍" }
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
      showOptions: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    setTimeout(() => {
      const responses = predefinedResponses[currentSubject] || predefinedResponses.matematik;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiResponse = {
        role: "assistant",
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
      setShowLanguageLearning(true);
      return;
    }

    const optionMessage = {
      role: "user",
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

      const aiResponse = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
        showOptions: false
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputMessage("Jeg vil gerne lære om brøker");
      }, 2000);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (showLanguageLearning) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => setShowLanguageLearning(false)}
          className="text-white border-gray-600 hover:bg-gray-700"
        >
          ← Tilbage til AI Lærer
        </Button>
        <LanguageLearning />
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
            {subjects.map((subject) => {
              const IconComponent = subject.icon;
              return (
                <Button
                  key={subject.id}
                  variant={currentSubject === subject.id ? "default" : "outline"}
                  className={`flex flex-col space-y-1 h-auto py-3 ${
                    currentSubject === subject.id 
                      ? "bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none" 
                      : "bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-purple-400 text-white"
                  }`}
                  onClick={() => {
                    setCurrentSubject(subject.id);
                    if (subject.id === "sprog") {
                      setShowLanguageLearning(true);
                    }
                  }}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs">{subject.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="h-96 bg-gray-900 border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white">Chat med din AI lærer</CardTitle>
        </CardHeader>
        <CardContent className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-400 to-cyan-400 text-white'
                        : 'bg-gray-800 text-gray-100 border border-gray-700'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('da-DK')}
                    </p>
                  </div>
                </div>
                
                {message.showOptions && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {learningOptions.map((option) => (
                      <Button
                        key={option.id}
                        variant="outline"
                        className="h-auto p-4 bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-purple-400 text-left"
                        onClick={() => handleLearningOption(option)}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{option.icon}</span>
                          <div>
                            <div className="font-medium text-white">{option.title}</div>
                            <div className="text-sm text-gray-300">{option.description}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Skriv dit spørgsmål her..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleListening}
              className={`border-gray-600 ${isListening ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-none" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={isSpeaking ? stopSpeaking : () => {}}
              className={`border-gray-600 ${isSpeaking ? "bg-blue-400 text-gray-900 border-blue-400" : "bg-gray-800 text-gray-300"}`}
              disabled={!isSpeaking}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button onClick={handleSendMessage} size="icon" className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none">
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {isListening && (
            <div className="mt-2 text-center">
              <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400 animate-pulse">
                🎤 Lytter... Tal nu!
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AITutor;
