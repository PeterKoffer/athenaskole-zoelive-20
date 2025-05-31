
import AILearningCTA from "./progress/AILearningCTA";
import SubjectProgressCards from "./progress/SubjectProgressCards";
import WeeklyActivityChart from "./progress/WeeklyActivityChart";
import AchievementsCard from "./progress/AchievementsCard";
import WeeklyGoalsCard from "./progress/WeeklyGoalsCard";
import ParentEmailCard from "./progress/ParentEmailCard";

interface UserProgress {
  matematik: number;
  dansk: number;
  engelsk: number;
  naturteknik: number;
}

interface ProgressDashboardProps {
  userProgress: UserProgress;
}

const ProgressDashboard = ({ userProgress }: ProgressDashboardProps) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AILearningCTA />
      
      <SubjectProgressCards userProgress={userProgress} />

      <div className="grid lg:grid-cols-2 gap-6">
        <WeeklyActivityChart />
        <AchievementsCard />
      </div>

      <WeeklyGoalsCard />
      
      <ParentEmailCard />
    </div>
  );
};

export default ProgressDashboard;
