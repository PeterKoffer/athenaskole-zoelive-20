
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import GradeAwareContentGenerator from './GradeAwareContentGenerator';

interface GradeContentSetupProps {
  subject: string;
  skillArea: string;
  onBack: () => void;
  onContentGenerated: (contentConfig: any) => void;
}

const GradeContentSetup = ({
  subject,
  skillArea,
  onBack,
  onContentGenerated
}: GradeContentSetupProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-center space-x-2">
            <GraduationCap className="w-5 h-5 text-lime-400" />
            <span>Preparing Grade-Level Content</span>
          </CardTitle>
        </CardHeader>
      </Card>
      
      <GradeAwareContentGenerator
        subject={subject}
        skillArea={skillArea}
        onContentGenerated={onContentGenerated}
      />
    </div>
  );
};

export default GradeContentSetup;
