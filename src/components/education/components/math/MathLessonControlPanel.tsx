
import { Button } from '@/components/ui/button';

interface MathLessonControlPanelProps {
  isSpeaking: boolean;
  onToggleMute: () => void;
  onReadRequest: () => void;
  onStopSpeaking: () => void;
}

const MathLessonControlPanel = ({
  isSpeaking,
  onToggleMute,
  onReadRequest,
  onStopSpeaking
}: MathLessonControlPanelProps) => {
  return (
    <div className="w-full bg-gray-800 border-b border-gray-700">
      <div className="w-full max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={onToggleMute}
            className="border-purple-400 text-purple-200 bg-gray-700/50"
          >
            {isSpeaking ? 'Mute Nelie' : 'Unmute Nelie'}
          </Button>
          
          <Button
            variant="outline"
            onClick={onReadRequest}
            className="border-blue-400 text-blue-200 bg-gray-700/50"
          >
            Ask Nelie to Repeat
          </Button>
          
          {isSpeaking && (
            <Button
              variant="outline"
              onClick={onStopSpeaking}
              className="border-red-400 text-red-200 bg-gray-700/50"
            >
              Stop Nelie
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MathLessonControlPanel;
