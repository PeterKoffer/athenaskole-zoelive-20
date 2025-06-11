
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface LessonControlsFooterProps {
  autoReadEnabled: boolean;
  isSpeaking: boolean;
  isReady: boolean;
  adaptiveSpeed: number;
  onMuteToggle: () => void;
  onManualRead: () => void;
  onResetProgress: () => void;
}

const LessonControlsFooter = ({
  autoReadEnabled,
  isSpeaking,
  isReady,
  adaptiveSpeed,
  onMuteToggle,
  onManualRead,
  onResetProgress
}: LessonControlsFooterProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700 mt-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onMuteToggle}
            className="border-purple-400"
          >
            {autoReadEnabled ? (
              <>
                <VolumeX className="w-4 h-4 mr-2" />
                Mute Nelie
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Unmute Nelie
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onManualRead}
            disabled={!isReady || !autoReadEnabled}
            className="border-blue-400"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onResetProgress}
            className="border-red-400"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart Lesson
          </Button>
        </div>

        <div className="text-center mt-2 text-sm text-gray-400">
          Adaptive Speed: {adaptiveSpeed.toFixed(1)}x
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonControlsFooter;
