
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';

interface NelieAvatarSectionProps {
  subject: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  isSpeaking: boolean;
  autoReadEnabled: boolean;
  onMuteToggle: () => void;
  onReadQuestion: () => void;
}

const NelieAvatarSection = ({
  subject,
  currentQuestionIndex,
  totalQuestions,
  isSpeaking,
  autoReadEnabled,
  onMuteToggle,
  onReadQuestion
}: NelieAvatarSectionProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-400 w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          {/* Avatar and Info Section */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <RobotAvatar size="xl" isActive={true} isSpeaking={isSpeaking} />
            <div className="text-white flex-1">
              <h3 className="text-base sm:text-lg font-semibold">Nelie is here to help!</h3>
              <p className="text-purple-200 text-sm sm:text-base">
                Working on {subject} • Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
          </div>
          
          {/* Button Controls Section */}
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('🔊 Mute button clicked, autoReadEnabled:', autoReadEnabled);
                onMuteToggle();
              }}
              className="border-purple-400 text-purple-900 bg-white hover:bg-purple-50 w-full sm:w-auto flex items-center justify-center"
            >
              {autoReadEnabled ? (
                <Volume2 className="w-4 h-4 mr-2" />
              ) : (
                <VolumeX className="w-4 h-4 mr-2" />
              )}
              <span className="text-sm sm:text-base">
                {autoReadEnabled ? 'Mute Nelie' : 'Unmute Nelie'}
              </span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('🔊 Read button clicked, autoReadEnabled:', autoReadEnabled);
                onReadQuestion();
              }}
              className="border-purple-400 text-purple-900 bg-white hover:bg-purple-50 disabled:opacity-50 w-full sm:w-auto flex items-center justify-center"
              disabled={!autoReadEnabled}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              <span className="text-sm sm:text-base">
                {isSpeaking ? 'Nelie is speaking...' : 'Ask Nelie to repeat'}
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NelieAvatarSection;
