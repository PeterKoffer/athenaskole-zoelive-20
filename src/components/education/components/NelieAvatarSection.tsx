
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
    <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-400">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <RobotAvatar size="xl" isActive={true} isSpeaking={isSpeaking} />
            <div className="text-white">
              <h3 className="text-lg font-semibold">Nelie is here to help!</h3>
              <p className="text-purple-200">Working on {subject} • Question {currentQuestionIndex + 1} of {totalQuestions}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onMuteToggle}
              className="border-purple-400 text-slate-950"
            >
              {autoReadEnabled ? (
                <Volume2 className="w-4 h-4 mr-2" />
              ) : (
                <VolumeX className="w-4 h-4 mr-2" />
              )}
              {autoReadEnabled ? 'Mute Nelie' : 'Unmute Nelie'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onReadQuestion}
              className="border-purple-400 text-slate-950"
              disabled={!autoReadEnabled}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {isSpeaking ? 'Nelie is speaking...' : 'Ask Nelie to repeat'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NelieAvatarSection;
