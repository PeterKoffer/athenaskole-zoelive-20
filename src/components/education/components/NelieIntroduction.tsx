
import UnifiedClassIntroduction from './UnifiedClassIntroduction';

interface NelieIntroductionProps {
  subject: string;
  skillArea: string;
  onIntroductionComplete: () => void;
}

const NelieIntroduction = ({
  subject,
  skillArea,
  onIntroductionComplete
}: NelieIntroductionProps) => {
  console.log('🎭 NelieIntroduction using unified system:', { subject, skillArea });

  return (
    <UnifiedClassIntroduction
      subject={subject}
      skillArea={skillArea}
      userLevel="beginner"
      onIntroductionComplete={onIntroductionComplete}
    />
  );
};

export default NelieIntroduction;
