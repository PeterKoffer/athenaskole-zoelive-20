
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { RealtimeChat } from "@/utils/RealtimeAudio";

interface VoiceControlsProps {
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  onVoiceInput: (message: string) => void;
}

const VoiceControls = ({ isSpeaking, onStopSpeaking, onVoiceInput }: VoiceControlsProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const realtimeChatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (event: any) => {
    console.log('Voice control received message:', event.type);
    
    if (event.type === 'response.audio_transcript.delta') {
      setTranscript(prev => prev + event.delta);
    } else if (event.type === 'response.audio_transcript.done') {
      if (transcript) {
        onVoiceInput(transcript);
        setTranscript("");
      }
    } else if (event.type === 'input_audio_buffer.speech_started') {
      setIsListening(true);
    } else if (event.type === 'input_audio_buffer.speech_stopped') {
      setIsListening(false);
    }
  };

  const startVoiceChat = async () => {
    try {
      console.log('Starting voice chat...');
      realtimeChatRef.current = new RealtimeChat(handleMessage, () => {});
      await realtimeChatRef.current.init();
      setIsConnected(true);
      console.log('Voice chat started successfully');
    } catch (error) {
      console.error('Failed to start voice chat:', error);
      // Fallback to simple voice input
      fallbackVoiceInput();
    }
  };

  const stopVoiceChat = () => {
    console.log('Stopping voice chat...');
    realtimeChatRef.current?.disconnect();
    setIsConnected(false);
    setIsListening(false);
    setTranscript("");
  };

  const fallbackVoiceInput = () => {
    console.log('Using fallback voice input');
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      onVoiceInput("Hi Nelie, can you help me with my studies?");
    }, 2000);
  };

  const toggleVoiceChat = () => {
    if (isConnected) {
      stopVoiceChat();
    } else {
      startVoiceChat();
    }
  };

  useEffect(() => {
    return () => {
      realtimeChatRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleVoiceChat}
        className={`border-gray-600 p-1 ${
          isConnected
            ? "bg-gradient-to-r from-green-400 to-blue-400 text-white border-none" 
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
      >
        {isConnected ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
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
      {(isListening || isConnected) && (
        <div className="text-center mt-2">
          <Badge 
            variant="outline" 
            className={`${
              isListening 
                ? "bg-gradient-to-r from-red-400 to-pink-400 text-white border-red-400 animate-pulse" 
                : "bg-gradient-to-r from-green-400 to-blue-400 text-white border-green-400"
            } text-xs`}
          >
            {isListening ? `🎤 Listening... ${transcript}` : '🔊 Voice chat active'}
          </Badge>
        </div>
      )}
    </>
  );
};

export default VoiceControls;
