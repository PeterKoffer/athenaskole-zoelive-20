
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, User, GraduationCap, Brain, Target } from 'lucide-react';
import { StudentProfile } from '@/types/studentProfile';

interface StudentProfileDisplayProps {
  profile: StudentProfile;
  onEdit: () => void;
}

const StudentProfileDisplay: React.FC<StudentProfileDisplayProps> = ({
  profile,
  onEdit
}) => {
  const getLearningStyleIcon = (style: string) => {
    switch (style) {
      case 'visual': return '👁️';
      case 'auditory': return '👂';
      case 'kinesthetic': return '🤲';
      default: return '🧠';
    }
  };

  const getGradeLevelDisplay = (grade: number) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const remainder = grade % 100;
    const suffix = suffixes[remainder > 10 && remainder < 14 ? 0 : (remainder % 10)] || suffixes[0];
    return `${grade}${suffix} Grade`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Student Profile
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Name
            </div>
            <p className="text-lg font-semibold">{profile.name}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              Grade Level
            </div>
            <p className="text-lg font-semibold">{getGradeLevelDisplay(profile.gradeLevel)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Brain className="h-4 w-4" />
              Learning Style
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getLearningStyleIcon(profile.learningStyle)}</span>
              <p className="text-lg font-semibold capitalize">{profile.learningStyle}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Target className="h-4 w-4" />
              Interests
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.interests.length > 0 ? (
                profile.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground italic">No interests added yet</p>
              )}
            </div>
          </div>
        </div>

        {Object.keys(profile.progress).length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Learning Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(profile.progress).map(([subject, skills]) => (
                <Card key={subject} className="p-3">
                  <h4 className="font-medium capitalize mb-2">{subject}</h4>
                  {typeof skills === 'object' && skills !== null ? (
                    <div className="space-y-1">
                      {Object.entries(skills as Record<string, number>).map(([skill, progress]) => (
                        <div key={skill} className="flex justify-between text-sm">
                          <span className="capitalize">{skill}</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No progress data</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentProfileDisplay;
