
import { useEffect } from 'react';

type UseActivityNavigationProps = {
  manualActivityIndex: number | null | undefined;
  currentActivityIndex: number;
  completedActivities: Set<number>;
  setCurrentActivityIndex: (idx: number) => void;
};

export const useActivityNavigation = ({
  manualActivityIndex,
  currentActivityIndex,
  completedActivities,
  setCurrentActivityIndex
}: UseActivityNavigationProps) => {
  useEffect(() => {
    if (manualActivityIndex !== null && manualActivityIndex !== undefined) {
      console.log('🧭 Manual navigation attempted to:', manualActivityIndex);
      if (manualActivityIndex < currentActivityIndex && completedActivities.has(manualActivityIndex)) {
        console.log('✅ Backward navigation allowed to completed activity:', manualActivityIndex);
        setCurrentActivityIndex(manualActivityIndex);
        return;
      }
      if (manualActivityIndex === currentActivityIndex + 1 && completedActivities.has(currentActivityIndex)) {
        console.log('✅ Forward navigation allowed to next activity:', manualActivityIndex);
        setCurrentActivityIndex(manualActivityIndex);
        return;
      }
      if (manualActivityIndex === currentActivityIndex) {
        console.log('✅ Staying on current activity:', manualActivityIndex);
        return;
      }
      console.log('❌ Navigation blocked - activity not accessible:', manualActivityIndex);
    }
  }, [manualActivityIndex, currentActivityIndex, completedActivities, setCurrentActivityIndex]);
};
