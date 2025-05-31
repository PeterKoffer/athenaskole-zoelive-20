
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import { Class } from "@/types/school";
import ClassSelector from "./class-management/ClassSelector";
import ClassOverviewTab from "./class-management/ClassOverviewTab";
import ClassStudentsTab from "./class-management/ClassStudentsTab";
import ClassScheduleTab from "./class-management/ClassScheduleTab";
import ClassAssignmentsTab from "./class-management/ClassAssignmentsTab";

const ClassManagement = () => {
  const [selectedClass, setSelectedClass] = useState<string>("1a");

  const [classes, setClasses] = useState<Class[]>([
    {
      id: "1a",
      name: "1.A",
      grade: "1. klasse",
      teacher: "Lærer Hansen",
      subject: "Matematik & Dansk",
      room: "Lokale 101",
      capacity: 25,
      schedule: "Man-Fre 08:00-14:00",
      students: [
        {
          id: "1",
          name: "Emma Nielsen",
          email: "emma@example.com",
          enrollmentDate: "2024-08-15",
          progress: 85,
          attendance: 96,
          grades: [
            { subject: "Matematik", grade: 8 },
            { subject: "Dansk", grade: 9 },
            { subject: "Engelsk", grade: 7 }
          ]
        },
        {
          id: "2",
          name: "Lucas Hansen",
          email: "lucas@example.com",
          enrollmentDate: "2024-08-15",
          progress: 78,
          attendance: 94,
          grades: [
            { subject: "Matematik", grade: 7 },
            { subject: "Dansk", grade: 8 },
            { subject: "Engelsk", grade: 8 }
          ]
        }
      ]
    },
    {
      id: "1b",
      name: "1.B",
      grade: "1. klasse",
      teacher: "Lærer Andersen",
      subject: "Matematik & Dansk",
      room: "Lokale 102",
      capacity: 25,
      schedule: "Man-Fre 08:00-14:00",
      students: [
        {
          id: "3",
          name: "Sofia Larsen",
          email: "sofia@example.com",
          enrollmentDate: "2024-08-15",
          progress: 92,
          attendance: 98,
          grades: [
            { subject: "Matematik", grade: 10 },
            { subject: "Dansk", grade: 9 },
            { subject: "Engelsk", grade: 9 }
          ]
        }
      ]
    }
  ]);

  const currentClass = classes.find(c => c.id === selectedClass);

  const updateClasses = (updatedClasses: Class[]) => {
    setClasses(updatedClasses);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Klasse Administration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ClassSelector 
            classes={classes} 
            selectedClass={selectedClass} 
            onClassSelect={setSelectedClass} 
          />
        </CardContent>
      </Card>

      {currentClass && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">Overblik</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-gray-700">Elever</TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-gray-700">Skema</TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-gray-700">Opgaver</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ClassOverviewTab currentClass={currentClass} />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <ClassStudentsTab 
              currentClass={currentClass}
              selectedClass={selectedClass}
              classes={classes}
              onUpdateClasses={updateClasses}
            />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <ClassScheduleTab currentClass={currentClass} />
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <ClassAssignmentsTab currentClass={currentClass} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ClassManagement;
