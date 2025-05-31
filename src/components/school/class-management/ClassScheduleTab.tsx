
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Class } from "@/types/school";

interface ClassScheduleTabProps {
  currentClass: Class;
}

const ClassScheduleTab = ({ currentClass }: ClassScheduleTabProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Ugeskema for {currentClass.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Detaljeret skema functionality kommer snart...</p>
      </CardContent>
    </Card>
  );
};

export default ClassScheduleTab;
