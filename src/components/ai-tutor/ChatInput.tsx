
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

const ChatInput = ({ onSendMessage, isSpeaking, onStopSpeaking }: ChatInputProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage);
    setInputMessage("");
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputMessage("I would like to learn about fractions");
      }, 2000);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your question here..."
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
          onClick={isSpeaking ? onStopSpeaking : () => {}}
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
        <div className="text-center">
          <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400 animate-pulse">
            🎤 Listening... Speak now!
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
