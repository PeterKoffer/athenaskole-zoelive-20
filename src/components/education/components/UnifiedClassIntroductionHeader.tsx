
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';

interface UnifiedClassIntroductionHeaderProps {
  title: string;
  userName: string;
  subject: string;
  isSpeaking: boolean;
}

const UnifiedClassIntroductionHeader = ({
  title,
  userName,
  subject,
  isSpeaking,
}: UnifiedClassIntroductionHeaderProps) => (
  <div className="text-center mb-6">
    <div className="flex justify-center mb-4">
      <RobotAvatar size="xl" isActive={true} isSpeaking={isSpeaking} />
    </div>
    <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
    <p className="text-purple-200">
      Welcome to your {subject} class with Nelie, {userName}!
    </p>
  </div>
);

export default UnifiedClassIntroductionHeader;
