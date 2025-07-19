
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
  subject?: string;
  skillArea?: string;
}

interface TodaysProgramGridProps {
  activities: Activity[];
  onStartActivity: (activityId: string) => void;
}

const TodaysProgramGrid = ({ activities, onStartActivity }: TodaysProgramGridProps) => {
  return (
    <div className="mb-8">
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
