
import ParentNotifications from "../../parent/ParentNotifications";

interface ChildProgressInfo {
  childName: string;
  weeklyMinutes: number;
  completedLessons: number;
  pronunciationScore: number;
  challengesCompleted: number;
  streak: number;
  newAchievements: string[];
}

interface EnhancedTutorParentsTabProps {
  childProgress: ChildProgressInfo;
}

const EnhancedTutorParentsTab = ({ childProgress }: EnhancedTutorParentsTabProps) => (
  <ParentNotifications
    childProgress={childProgress}
    parentEmail="parents@example.com"
  />
);

export default EnhancedTutorParentsTab;
