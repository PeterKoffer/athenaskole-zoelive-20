
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const WeeklyActivityChart = () => {
  const weeklyData = [
    { day: "Monday", mathematics: 45, danish: 30, english: 20 },
    { day: "Tuesday", mathematics: 60, danish: 40, english: 35 },
    { day: "Wednesday", mathematics: 30, danish: 55, english: 25 },
    { day: "Thursday", mathematics: 75, danish: 20, english: 40 },
    { day: "Friday", mathematics: 40, danish: 35, english: 30 },
    { day: "Saturday", mathematics: 20, danish: 15, english: 45 },
    { day: "Sunday", mathematics: 35, danish: 25, english: 20 }
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
                <span>{day.mathematics + day.danish + day.english} minutes</span>
              </div>
              <div className="flex space-x-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500" 
                  style={{ width: `${(day.mathematics / 120) * 100}%` }}
                />
                <div 
                  className="bg-red-500" 
                  style={{ width: `${(day.danish / 120) * 100}%` }}
                />
                <div 
                  className="bg-green-500" 
                  style={{ width: `${(day.english / 120) * 100}%` }}
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
