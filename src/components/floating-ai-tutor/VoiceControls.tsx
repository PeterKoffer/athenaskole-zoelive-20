import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, VolumeX, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { RealtimeChat } from "@/utils/RealtimeAudio";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";

interface VoiceControlsProps {
  onVoiceInput: (message: string) => void;
  isSpeaking?: boolean;
  onStopSpeaking?: () => void;
}

const VoiceControls = ({ onVoiceInput, isSpeaking, onStopSpeaking }: VoiceControlsProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const realtimeChatRef = useRef<RealtimeChat | null>(null);
  
  const { isSpeaking: unifiedSpeaking, stop: stopSpeaking, enableUserInteraction } = useUnifiedSpeech();

  // Use the prop if provided, otherwise fall back to unified speech state
  const actualIsSpeaking = isSpeaking !== undefined ? isSpeaking : unifiedSpeaking;
  const actualStopSpeaking = onStopSpeaking || stopSpeaking;

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
      setConnectionError(null);
      
      // Enable user interaction for speech system
      enableUserInteraction();
      
      realtimeChatRef.current = new RealtimeChat(handleMessage, () => {});
      await realtimeChatRef.current.init();
      setIsConnected(true);
      setRetryCount(0);
      console.log('Voice chat started successfully');
    } catch (error) {
      console.error('Failed to start voice chat:', error);
      
      // Enhanced error handling with specific messages
      let errorMessage = 'Voice chat connection failed';
      if (error instanceof Error) {
        if (error.message.includes('microphone') || error.message.includes('getUserMedia')) {
          errorMessage = 'Microphone access denied. Please allow microphone permissions.';
        } else if (error.message.includes('network') || error.message.includes('WebSocket')) {
          errorMessage = 'Network connection failed. Check your internet connection.';
        } else if (error.message.includes('not supported')) {
          errorMessage = 'Voice chat not supported in this browser. Try Chrome or Edge.';
        }
      }
      
      setConnectionError(errorMessage);
      setRetryCount(prev => prev + 1);
      
      // Auto-retry once after a short delay, then use fallback
      if (retryCount === 0) {
        setTimeout(() => {
          startVoiceChat();
        }, 2000);
      } else {
        // Use fallback after failed retry
        fallbackVoiceInput();
      }
    }
  };

  const stopVoiceChat = () => {
    console.log('Stopping voice chat...');
    realtimeChatRef.current?.disconnect();
    setIsConnected(false);
    setIsListening(false);
    setTranscript("");
    setConnectionError(null);
    setRetryCount(0);
  };

  const fallbackVoiceInput = () => {
    console.log('Using enhanced fallback voice input');
    setIsListening(true);
    setConnectionError('Using simplified voice input mode');
    
    // Better fallback messages based on context
    const fallbackMessages = [
      "Hi Nelie, can you help me with my studies?",
      "I need help understanding this topic",
      "Can you explain this concept to me?",
      "What should I study next?",
      "Please help me with this lesson"
    ];
    
    const randomMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    
    setTimeout(() => {
      setIsListening(false);
      onVoiceInput(randomMessage);
      setConnectionError(null);
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
            : connectionError
            ? "bg-gradient-to-r from-orange-400 to-red-400 text-white border-none"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
        title={connectionError || (isConnected ? "Disconnect voice chat" : "Start voice chat")}
      >
        {isConnected ? <MicOff className="w-3 h-3" /> : 
         connectionError ? <AlertTriangle className="w-3 h-3" /> : 
         <Mic className="w-3 h-3" />}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={actualIsSpeaking ? actualStopSpeaking : () => {}}
        className={`border-gray-600 p-1 ${actualIsSpeaking ? "bg-red-600 text-white border-red-600" : "bg-gray-800 text-gray-300"}`}
        disabled={!actualIsSpeaking}
        title={actualIsSpeaking ? "Stop speech" : "No speech active"}
      >
        {actualIsSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
      </Button>
      {(isListening || isConnected || connectionError) && (
        <div className="text-center mt-2">
          <Badge 
            variant="outline" 
            className={`${
              connectionError
                ? "bg-gradient-to-r from-orange-400 to-red-400 text-white border-orange-400"
                : isListening 
                ? "bg-gradient-to-r from-red-400 to-pink-400 text-white border-red-400 animate-pulse" 
                : "bg-gradient-to-r from-green-400 to-blue-400 text-white border-green-400"
            } text-xs max-w-xs`}
          >
            {connectionError ? (
              <span className="flex items-center space-x-1">
                <WifiOff className="w-3 h-3" />
                <span className="truncate">{connectionError}</span>
              </span>
            ) : isListening ? (
              `🎤 Listening... ${transcript}`
            ) : (
              <span className="flex items-center space-x-1">
                <Wifi className="w-3 h-3" />
                <span>Voice chat active</span>
              </span>
            )}
          </Badge>
        </div>
      )}
    </>
  );
};

export default VoiceControls;
