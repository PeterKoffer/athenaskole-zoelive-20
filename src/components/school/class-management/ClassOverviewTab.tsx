
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar } from "lucide-react";
import { Class } from "@/types/school";

interface ClassOverviewTabProps {
  currentClass: Class;
}

const ClassOverviewTab = ({ currentClass }: ClassOverviewTabProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">{currentClass.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Lærer:</span>
            <span className="text-white">{currentClass.teacher}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Lokale:</span>
            <span className="text-white">{currentClass.room}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Kapacitet:</span>
            <span className="text-white">{currentClass.students.length}/{currentClass.capacity}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Fag:</span>
            <span className="text-white">{currentClass.subject}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Præstation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Gennemsnit fremskridt:</span>
            <Badge variant="outline" className="text-green-400 border-green-400">
              {Math.round(currentClass.students.reduce((acc, s) => acc + s.progress, 0) / currentClass.students.length)}%
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Gennemsnit fremmøde:</span>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {Math.round(currentClass.students.reduce((acc, s) => acc + s.attendance, 0) / currentClass.students.length)}%
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Aktive elever:</span>
            <span className="text-white">{currentClass.students.length}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Skema Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Skema</p>
            <p className="text-white">{currentClass.schedule}</p>
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            <Calendar className="w-4 h-4 mr-2" />
            Se Fuldt Skema
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassOverviewTab;
