
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';

interface UnifiedClassIntroductionHeaderProps {
  userName: string;
  subject: string;
  isSpeaking: boolean;
}

const UnifiedClassIntroductionHeader = ({
  userName,
  subject,
  isSpeaking,
}: UnifiedClassIntroductionHeaderProps) => (
  <div className="text-center mb-6">
    <div className="flex justify-center mb-4">
      <RobotAvatar size="xl" isActive={true} isSpeaking={isSpeaking} />
    </div>
    <h2 className="text-3xl font-bold text-white mb-2">{`Welcome to ${
      subject.charAt(0).toUpperCase() + subject.slice(1)
    } with Nelie, ${userName}!`}</h2>
  </div>
);

export default UnifiedClassIntroductionHeader;
