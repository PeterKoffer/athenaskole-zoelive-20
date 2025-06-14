
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Volume2, RotateCcw } from "lucide-react";
import RobotAvatar from "./RobotAvatar";
import { usePronunciationPractice } from "./hooks/usePronunciationPractice";
import { PronunciationFeedbackBadge } from "./PronunciationFeedbackBadge";

interface SpeechRecognitionProps {
  targetText: string;
  language: string;
  onScoreUpdate: (score: number) => void;
}

const SpeechRecognition = ({
  targetText,
  language,
  onScoreUpdate,
}: SpeechRecognitionProps) => {
  const {
    isListening,
    isPlayingExample,
    transcription,
    pronunciationScore,
    feedback,
    startListening,
    stopListening,
    playTargetAudio,
    reset,
  } = usePronunciationPractice({
    targetText,
    language,
    onScoreUpdate,
  });

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <RobotAvatar
              size="lg"
              isActive={isListening || isPlayingExample}
              isSpeaking={isPlayingExample}
            />
            <h3 className="text-lg font-semibold text-white">Pronunciation Practice</h3>
          </div>
          <div className="bg-gray-600 p-3 rounded-lg mb-4">
            <p className="text-white font-medium">Say: "{targetText}"</p>
            <Button
              variant="outline"
              size="sm"
              onClick={playTargetAudio}
              className="mt-2 text-gray-300 border-gray-600 hover:bg-gray-600"
              disabled={isPlayingExample}
            >
              <Volume2 className="w-4 h-4 mr-1" />
              {isPlayingExample ? "Playing..." : "Listen to example"}
            </Button>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`${
              isListening
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            } transition-colors`}
            size="lg"
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                Start recording
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={reset}
            className="text-gray-300 border-gray-600 hover:bg-gray-600"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {isListening && (
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
              <p className="text-gray-300">Listening...</p>
            </div>
          </div>
        )}

        {transcription && (
          <div className="space-y-3">
            <div className="bg-gray-600 p-3 rounded-lg">
              <p className="text-gray-300 text-sm">You said:</p>
              <p className="text-white font-medium">"{transcription}"</p>
            </div>
            <PronunciationFeedbackBadge score={pronunciationScore} feedback={feedback} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeechRecognition;
