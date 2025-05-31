
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const WeeklyActivityChart = () => {
  const weeklyData = [
    { day: "Monday", matematik: 45, dansk: 30, engelsk: 20 },
    { day: "Tuesday", matematik: 60, dansk: 40, engelsk: 35 },
    { day: "Wednesday", matematik: 30, dansk: 55, engelsk: 25 },
    { day: "Thursday", matematik: 75, dansk: 20, engelsk: 40 },
    { day: "Friday", matematik: 40, dansk: 35, engelsk: 30 },
    { day: "Saturday", matematik: 20, dansk: 15, engelsk: 45 },
    { day: "Sunday", matematik: 35, dansk: 25, engelsk: 20 }
  ];

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Calendar className="w-5 h-5 text-lime-400" />
          <span>Weekly Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weeklyData.map((day, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-white">
                <span>{day.day}</span>
                <span>{day.matematik + day.dansk + day.engelsk} minutes</span>
              </div>
              <div className="flex space-x-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500" 
                  style={{ width: `${(day.matematik / 120) * 100}%` }}
                />
                <div 
                  className="bg-red-500" 
                  style={{ width: `${(day.dansk / 120) * 100}%` }}
                />
                <div 
                  className="bg-green-500" 
                  style={{ width: `${(day.engelsk / 120) * 100}%` }}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Mathematics</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Danish</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>English</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivityChart;
