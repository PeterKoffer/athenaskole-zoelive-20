
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LanguageLearning from "./LanguageLearning";
import SubjectSelector from "./ai-tutor/SubjectSelector";
import ChatMessage from "./ai-tutor/ChatMessage";
import LearningOptions from "./ai-tutor/LearningOptions";
import ChatInput from "./ai-tutor/ChatInput";
import LanguageSelector from "./ai-tutor/LanguageSelector";
import { useMessageHandler } from "./ai-tutor/useMessageHandler";
import { speechService } from "@/services/SpeechService";

import { speechRecognitionService } from "@/services/SpeechRecognitionService";
import { Volume2, VolumeX } from "lucide-react";

const AITutor = ({ user }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [currentSubject, setCurrentSubject] = useState("math");
  const [showLanguageLearning, setShowLanguageLearning] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const messagesEndRef = useRef(null);

  const { messages, handleSendMessage, handleLearningOption } = useMessageHandler({
    user,
    currentSubject,
    setIsSpeaking
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (speechEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'ai') {
        speechService.speak(lastMessage.text);
      }
    }
  }, [messages, speechEnabled]);

  const handleLearningOptionWithLanguageCheck = (option) => {
    if (option.id === "language") {
      setShowLanguageSelection(true);
      return;
    }
    handleLearningOption(option);
  };

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setShowLanguageSelection(false);
    setShowLanguageLearning(true);
  };

  const stopSpeaking = () => {
    speechService.cancel();
    setIsSpeaking(false);

  };

  const handleStartRecording = () => {
    setIsRecording(true);
    speechRecognitionService.start();
    speechRecognitionService.onResult((result) => {
      handleSendMessage(result);
      setIsRecording(false);
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    speechRecognitionService.stop();

  };

  if (showLanguageSelection) {
    return (
      <LanguageSelector
        onLanguageSelect={handleLanguageSelect}
        onBack={() => setShowLanguageSelection(false)}
      />
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
          ← Back to AI Tutor
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
              <span>AI Tutor - Your Personal Athena</span>
            </span>
            <div className="flex items-center space-x-2">
              <Button onClick={() => setSpeechEnabled(!speechEnabled)} size="icon" variant="ghost">
                {speechEnabled ? <Volume2 /> : <VolumeX />}
              </Button>
              <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400">
                GPT-4o + ElevenLabs English
              </Badge>
            </div>
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
          <CardTitle className="text-lg text-white">Chat with your AI tutor</CardTitle>
        </CardHeader>
        <CardContent className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message}>
                {message.showOptions && (
                  <LearningOptions onOptionSelect={handleLearningOptionWithLanguageCheck} />
                )}
              </ChatMessage>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            isSpeaking={isSpeaking}
            onStopSpeaking={stopSpeaking}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            isRecording={isRecording}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AITutor;
