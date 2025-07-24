
// import UnifiedClassIntroduction from './UnifiedClassIntroduction';

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
    <div className="text-white text-center p-8">
      <h2 className="text-2xl mb-4">Introduction temporarily disabled</h2>
      <button 
        onClick={onIntroductionComplete}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Continue to Lesson
      </button>
    </div>
  );
};

export default NelieIntroduction;
