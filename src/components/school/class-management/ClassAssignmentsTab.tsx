
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { Class } from "@/types/school";

interface ClassAssignmentsTabProps {
  currentClass: Class;
}

const ClassAssignmentsTab = ({ currentClass }: ClassAssignmentsTabProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <ClipboardList className="w-5 h-5 mr-2" />
          Opgaver og Bedømmelser
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Opgave administration kommer snart...</p>
      </CardContent>
    </Card>
  );
};

export default ClassAssignmentsTab;
