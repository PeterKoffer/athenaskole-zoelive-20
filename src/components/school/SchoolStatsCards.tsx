
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Calendar } from "lucide-react";
import { SchoolStats } from "@/types/school";

interface SchoolStatsCardsProps {
  stats: SchoolStats;
}

const SchoolStatsCards = ({ stats }: SchoolStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
              <p className="text-gray-400">Elever</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalTeachers}</p>
              <p className="text-gray-400">Lærere</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.averageProgress}%</p>
              <p className="text-gray-400">Gennemsnit fremskridt</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Calendar className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.attendanceRate}%</p>
              <p className="text-gray-400">Fremmøde</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolStatsCards;
