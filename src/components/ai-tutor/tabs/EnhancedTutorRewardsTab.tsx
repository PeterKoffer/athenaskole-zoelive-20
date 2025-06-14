
import RewardsSystem from "../../gamification/RewardsSystem";

interface EnhancedTutorRewardsTabProps {
  currentCoins: number;
  onPurchase: (rewardId: string, cost: number) => void;
}

const EnhancedTutorRewardsTab = ({ currentCoins, onPurchase }: EnhancedTutorRewardsTabProps) => (
  <RewardsSystem
    currentCoins={currentCoins}
    onPurchase={onPurchase}
  />
);

export default EnhancedTutorRewardsTab;
