
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  duration: string;
  level: string;
  color: string;
}

interface ActivityCardProps {
  activity: Activity;
  onStartActivity: (activityId: string) => void;
}

const ActivityCard = ({ activity, onStartActivity }: ActivityCardProps) => {
  const IconComponent = activity.icon;

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-purple-400 transition-all duration-300 cursor-pointer transform hover:scale-105">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${activity.color}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-bold">{activity.title}</h3>
              <p className="text-gray-300 text-sm">{activity.description}</p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
              <Clock className="w-3 h-3 mr-1" />
              {activity.duration}
            </Badge>
            <Badge variant="outline" className="bg-blue-600 text-white border-blue-600">
              {activity.level}
            </Badge>
          </div>
        </div>
        <Button 
          onClick={() => onStartActivity(activity.id)} 
          className={`w-full bg-gradient-to-r ${activity.color} hover:opacity-90 text-white border-none`}
        >
          Start {activity.title}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
