
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface VoiceControlsProps {
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  onVoiceInput: (message: string) => void;
}

const VoiceControls = ({ isSpeaking, onStopSpeaking, onVoiceInput }: VoiceControlsProps) => {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        onVoiceInput("Hi Nelie");
      }, 2000);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleListening}
        className={`border-gray-600 p-1 ${isListening ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-none" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
      >
        {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={isSpeaking ? onStopSpeaking : () => {}}
        className={`border-gray-600 p-1 ${isSpeaking ? "bg-blue-400 text-gray-900 border-blue-400" : "bg-gray-800 text-gray-300"}`}
        disabled={!isSpeaking}
      >
        {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
      </Button>
      {isListening && (
        <div className="text-center mt-2">
          <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400 animate-pulse text-xs">
            🎤 Lytter... Sig 'Hi Nelie'!
          </Badge>
        </div>
      )}
    </>
  );
};

export default VoiceControls;
