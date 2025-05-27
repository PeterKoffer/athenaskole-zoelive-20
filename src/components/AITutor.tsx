
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";

const AITutor = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hej! Jeg er din AI-lærer. Hvad vil du gerne lære i dag? 🇩🇰",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSubject, setCurrentSubject] = useState("matematik");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const subjects = [
    { id: "matematik", name: "Matematik", emoji: "🔢" },
    { id: "dansk", name: "Dansk", emoji: "📝" },
    { id: "engelsk", name: "Engelsk", emoji: "🇬🇧" },
    { id: "naturteknik", name: "Natur & Teknik", emoji: "🧪" },
    { id: "historie", name: "Historie", emoji: "🏰" },
    { id: "samfundsfag", name: "Samfundsfag", emoji: "🏛️" }
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
    ]
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      const responses = predefinedResponses[currentSubject] || predefinedResponses.matematik;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiResponse = {
        role: "assistant",
        content: randomResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Simulate text-to-speech
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

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would start/stop speech recognition
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <span className="text-2xl">🎓</span>
              <span>AI Lærer - Personlig Tutor</span>
            </span>
            <Badge variant="outline" className="bg-green-100 text-green-800">
              GPT-4o + ElevenLabs Dansk
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
            {subjects.map((subject) => (
              <Button
                key={subject.id}
                variant={currentSubject === subject.id ? "default" : "outline"}
                className={`flex flex-col space-y-1 h-auto py-3 ${
                  currentSubject === subject.id 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "hover:bg-red-50 hover:text-red-700"
                }`}
                onClick={() => setCurrentSubject(subject.id)}
              >
                <span className="text-lg">{subject.emoji}</span>
                <span className="text-xs">{subject.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="h-96">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Chat med din AI lærer</CardTitle>
        </CardHeader>
        <CardContent className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('da-DK')}
                  </p>
                </div>
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
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleListening}
              className={isListening ? "bg-red-100 text-red-600" : ""}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={isSpeaking ? stopSpeaking : () => {}}
              className={isSpeaking ? "bg-blue-100 text-blue-600" : ""}
              disabled={!isSpeaking}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button onClick={handleSendMessage} size="icon" className="bg-red-600 hover:bg-red-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {isListening && (
            <div className="mt-2 text-center">
              <Badge variant="outline" className="bg-red-50 text-red-600 animate-pulse">
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
