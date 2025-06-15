
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';

interface IntroductionHeaderProps {
  title: string;
  userName: string;
  subject: string;
  isSpeaking: boolean;
}

const IntroductionHeader = ({ title, userName, subject, isSpeaking }: IntroductionHeaderProps) => (
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

export default IntroductionHeader;
