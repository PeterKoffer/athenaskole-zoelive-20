
import { useState, useRef } from "react";
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
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          onVoiceInput(finalTranscript);
          setIsListening(false);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.start();
    } else {
      // Fallback for browsers without speech recognition
      console.log('Speech recognition not supported, using fallback');
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        onVoiceInput("Hello Nelie, can you help me with my studies?");
      }, 2000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
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
        className={`border-gray-600 p-1 ${isSpeaking ? "bg-red-600 text-white border-red-600" : "bg-gray-800 text-gray-300"}`}
        disabled={!isSpeaking}
      >
        {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
      </Button>
      {isListening && (
        <div className="text-center mt-2">
          <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400 animate-pulse text-xs">
            🎤 Listening... {transcript && `"${transcript}"`}
          </Badge>
        </div>
      )}
    </>
  );
};

export default VoiceControls;
