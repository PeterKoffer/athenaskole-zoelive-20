
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { subjectsData } from '@/data/subjectSkillData';

export interface SubjectSelectorProps {
  onSubjectSelect?: (subject: string, skillArea: string) => void;
  selectedMode?: any;
  currentSubject?: string;
  onSubjectChange?: (subject: string) => void;
  onLanguageSelect?: () => void;
}

const SubjectSelector = ({ onSubjectSelect, selectedMode }: SubjectSelectorProps) => {
  const navigate = useNavigate();

  const subjects = subjectsData;

  const handleSubjectSelect = (subject: string, skillArea: string, route: string) => {
    console.log('🚀 Starting AI learning session:', { subject, skillArea, route });
    
    if (onSubjectSelect) {
      onSubjectSelect(subject, skillArea);
    }
    
    // Navigate to the appropriate AI learning route
    navigate(route);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Subject</h2>
        <p className="text-gray-400">Select a subject and skill area to begin your AI learning session</p>
        {selectedMode && (
          <Badge className="mt-2 bg-purple-600 text-white">
            {selectedMode.name} Mode
          </Badge>
        )}
      </div>

      <div className="grid gap-6">
        {subjects.map((subject) => {
          const IconComponent = subject.icon;
          
          return (
            <Card key={subject.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <IconComponent className="w-6 h-6 text-lime-400" />
                  <span>{subject.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {subject.skillAreas.map((skillArea) => (
                    <Card key={skillArea.id} className="bg-gray-700 border-gray-600 hover:border-purple-400 transition-all cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white">{skillArea.name}</h3>
                          <Brain className="w-4 h-4 text-lime-400" />
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{skillArea.description}</p>
                        <Button 
                          onClick={() => handleSubjectSelect(subject.id, skillArea.id, skillArea.route)}
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white"
                          size="sm"
                        >
                          Start Learning
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectSelector;
