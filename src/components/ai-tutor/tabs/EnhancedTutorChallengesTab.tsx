
import DailyChallenges from "../../gamification/DailyChallenges";

interface EnhancedTutorChallengesTabProps {
  onChallengeComplete: (challengeId: string, reward: number) => void;
}

const EnhancedTutorChallengesTab = ({ onChallengeComplete }: EnhancedTutorChallengesTabProps) => (
  <DailyChallenges onChallengeComplete={onChallengeComplete} />
);

export default EnhancedTutorChallengesTab;
