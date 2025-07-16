
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff, VolumeX } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isSpeaking?: boolean;
  onStopSpeaking?: () => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  isRecording?: boolean;
}

const ChatInput = ({
  onSendMessage,
  isSpeaking = false,
  onStopSpeaking,
  onStartRecording,
  onStopRecording,
  isRecording = false
}: ChatInputProps) => {
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex space-x-2 items-center">
      <Input
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Ask me anything..."
        onKeyPress={handleKeyPress}
        className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
      />
      {isSpeaking && onStopSpeaking && (
        <Button
          variant="outline"
          size="icon"
          onClick={onStopSpeaking}
          className="bg-red-600 text-white border-red-600 hover:bg-red-700"
        >
          <VolumeX className="w-4 h-4" />
        </Button>
      )}
      <Button
        onClick={isRecording ? onStopRecording : onStartRecording}
        size="icon"
        variant="outline"
        className="border-gray-600 text-white bg-gray-800 hover:bg-gray-700"
      >
        {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>
      <Button 
        onClick={handleSendMessage} 
        size="icon"
        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ChatInput;
