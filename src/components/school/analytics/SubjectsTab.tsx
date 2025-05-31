
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { subjectPerformance } from "@/data/schoolAnalytics";

const SubjectsTab = () => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Subject Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjectPerformance.map((subject, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-white font-medium">{subject.subject}</p>
                  <p className="text-gray-400 text-sm">{subject.students} students</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${subject.score}%` }}
                  ></div>
                </div>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {subject.score}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectsTab;
