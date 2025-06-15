
import UnifiedClassIntroduction from './UnifiedClassIntroduction';

interface NelieIntroductionProps {
  subject: string;
  skillArea: string;
  onIntroductionComplete: () => void;
  isAdvancing?: boolean;
}

const NelieIntroduction = ({
  subject,
  skillArea,
  onIntroductionComplete,
  isAdvancing
}: NelieIntroductionProps) => {
  console.log('🎭 NelieIntroduction using unified system:', { subject, skillArea });

  return (
    <UnifiedClassIntroduction
      subject={subject}
      skillArea={skillArea}
      userLevel="beginner"
      onIntroductionComplete={onIntroductionComplete}
      isAdvancing={isAdvancing}
    />
  );
};

export default NelieIntroduction;
