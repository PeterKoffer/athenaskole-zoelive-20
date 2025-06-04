
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';

interface IntroductionHeaderProps {
  subject: string;
  isSpeaking: boolean;
}

const IntroductionHeader = ({ subject, isSpeaking }: IntroductionHeaderProps) => {
  return (
    <div className="text-center">
      <div className="mb-6">
        <RobotAvatar size="4xl" isActive={true} isSpeaking={isSpeaking} />
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-4">
        Welcome to {subject.charAt(0).toUpperCase() + subject.slice(1)} with Nelie!
      </h1>
    </div>
  );
};

export default IntroductionHeader;
