
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SubjectSelector from "./SubjectSelector";

interface TutorHeaderProps {
  currentCoins: number;
  currentSubject: string;
  onSubjectChange: (subject: string) => void;
  onLanguageSelect: () => void;
}

const TutorHeader = ({ 
  currentCoins, 
  currentSubject, 
  onSubjectChange, 
  onLanguageSelect 
}: TutorHeaderProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2 text-white">
            <span className="text-2xl">🎓</span>
            <span>Nelie AI Tutor</span>
          </span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-yellow-600 text-white border-yellow-600">
              {currentCoins} ⭐
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SubjectSelector
          currentSubject={currentSubject}
          onSubjectChange={onSubjectChange}
          onLanguageSelect={onLanguageSelect}
        />
      </CardContent>
    </Card>
  );
};

export default TutorHeader;
