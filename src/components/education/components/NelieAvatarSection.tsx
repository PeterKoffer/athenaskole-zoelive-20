
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface NelieAvatarSectionProps {
  isSpeaking: boolean;
  autoReadEnabled: boolean;
  hasUserInteracted: boolean;
  isReady: boolean;
  onToggleMute: () => void;
  onReadRequest: () => void;
  engagementLevel: number;
  adaptiveSpeed: number;
}

const NelieAvatarSection = ({
  isSpeaking,
  autoReadEnabled,
  hasUserInteracted,
  isReady,
  onToggleMute,
  onReadRequest,
  engagementLevel,
  adaptiveSpeed
}: NelieAvatarSectionProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isSpeaking) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking]);

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Nelie Avatar */}
            <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center ${isAnimating ? 'animate-pulse' : ''}`}>
              <div className="text-2xl">🔢</div>
              {isSpeaking && (
                <div className="absolute -inset-1 rounded-full border-2 border-lime-400 animate-ping"></div>
              )}
            </div>

            {/* Nelie Info */}
            <div>
              <h3 className="text-white font-semibold">
                Nelie - Your Mathematics Tutor
              </h3>
              <p className="text-gray-400 text-sm">
                {hasUserInteracted ? 'Ready to help!' : 'Say hello to get started!'}
              </p>
              <div className="text-xs text-gray-500">
                Engagement: {engagementLevel}% | Speed: {adaptiveSpeed}x
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMute}
              className={`${autoReadEnabled ? 'text-lime-400 hover:text-lime-300' : 'text-gray-400 hover:text-gray-300'}`}
            >
              {autoReadEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onReadRequest}
              className="text-blue-400 hover:text-blue-300"
              disabled={!isReady}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NelieAvatarSection;
