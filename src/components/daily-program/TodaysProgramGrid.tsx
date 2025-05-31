
import { Target } from "lucide-react";
import AIEnhancedActivityCard from "./AIEnhancedActivityCard";
import { LucideIcon } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  duration: string;
  level: string;
  color: string;
  aiEnhanced?: boolean;
}

interface TodaysProgramGridProps {
  activities: Activity[];
  onStartActivity: (activityId: string) => void;
}

const TodaysProgramGrid = ({ activities, onStartActivity }: TodaysProgramGridProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
        <Target className="w-6 h-6 text-cyan-400" />
        <span>Today's Program</span>
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {activities.map(activity => (
          <AIEnhancedActivityCard 
            key={activity.id}
            activity={activity}
            onStartActivity={onStartActivity}
          />
        ))}
      </div>
    </div>
  );
};

export default TodaysProgramGrid;
