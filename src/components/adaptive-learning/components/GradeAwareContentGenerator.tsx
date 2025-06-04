
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGradeLevelContent } from '@/hooks/useGradeLevelContent';
import { commonStandardsAPI } from '@/services/commonStandardsAPI';
import { GraduationCap, Target, BookOpen } from 'lucide-react';

interface GradeAwareContentGeneratorProps {
  subject: string;
  skillArea: string;
  onContentGenerated: (contentConfig: any) => void;
}

const GradeAwareContentGenerator = ({ 
  subject, 
  skillArea, 
  onContentGenerated 
}: GradeAwareContentGeneratorProps) => {
  const { gradeConfig, loading, getStandardForSkillArea } = useGradeLevelContent(subject);
  const [selectedStandard, setSelectedStandard] = useState<any>(null);

  useEffect(() => {
    if (gradeConfig && skillArea) {
      generateGradeAppropriateContent();
    }
  }, [gradeConfig, skillArea]);

  const generateGradeAppropriateContent = () => {
    if (!gradeConfig) return;

    // Find the most appropriate standard for the skill area
    const standard = getStandardForSkillArea(skillArea);
    
    if (standard) {
      setSelectedStandard(standard);
      
      // Generate content configuration based on the standard
      const contentConfig = {
        gradeLevel: gradeConfig.userGrade,
        standard: standard,
        difficultyRange: gradeConfig.difficultyRange,
        subject: subject,
        skillArea: skillArea,
        prerequisites: gradeConfig.prerequisites.filter(p => 
          p.domain === standard.domain
        ),
        contentPrompt: createGradeSpecificPrompt(standard, gradeConfig.userGrade)
      };

      console.log('🎯 Generated grade-appropriate content config:', contentConfig);
      onContentGenerated(contentConfig);
    }
  };

  const createGradeSpecificPrompt = (standard: any, grade: number): string => {
    const gradeDescriptors = {
      1: "very simple, concrete concepts with visual examples",
      2: "basic concepts with clear, simple language",
      3: "foundational skills with some abstract thinking",
      4: "intermediate concepts with problem-solving",
      5: "more complex ideas with real-world applications",
      6: "middle school level with analytical thinking",
      7: "pre-algebra concepts with logical reasoning",
      8: "advanced middle school with abstract concepts",
      9: "high school foundation with critical thinking",
      10: "intermediate high school with complex analysis",
      11: "advanced high school with synthesis skills",
      12: "college-prep level with sophisticated reasoning"
    };

    return `Create content for Grade ${grade} (${gradeDescriptors[grade as keyof typeof gradeDescriptors]}) 
aligned with ${standard.code}: ${standard.title}. 
Focus on: ${standard.description}
Use age-appropriate language, examples, and difficulty level.
Ensure content builds on previous grade knowledge and prepares for next grade concepts.`;
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <GraduationCap className="w-8 h-8 text-lime-400 animate-pulse mx-auto mb-4" />
          <p className="text-white">Loading grade-appropriate content...</p>
        </CardContent>
      </Card>
    );
  }

  if (!gradeConfig) {
    return (
      <Card className="bg-red-900 border-red-700">
        <CardContent className="p-6 text-center">
          <p className="text-white">Unable to determine appropriate grade level</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <GraduationCap className="w-5 h-5 text-lime-400" />
          <span>Grade {gradeConfig.userGrade} - {subject.charAt(0).toUpperCase() + subject.slice(1)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-600 text-white border-blue-600">
            Difficulty: {gradeConfig.difficultyRange[0]}-{gradeConfig.difficultyRange[1]}
          </Badge>
          <Badge variant="outline" className="bg-green-600 text-white border-green-600">
            Standards-Aligned
          </Badge>
        </div>

        {selectedStandard && (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-lime-400 mt-1" />
              <div>
                <h4 className="text-white font-medium">{selectedStandard.code}</h4>
                <p className="text-gray-300 text-sm">{selectedStandard.title}</p>
                <p className="text-gray-400 text-xs mt-1">{selectedStandard.description}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h5 className="text-white font-medium flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-lime-400" />
            <span>Available Skill Areas for Grade {gradeConfig.userGrade}</span>
          </h5>
          <div className="flex flex-wrap gap-2">
            {gradeConfig.skillAreas.map((area, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className={`text-xs ${
                  area === skillArea 
                    ? 'bg-lime-600 text-white border-lime-600' 
                    : 'text-gray-300 border-gray-600'
                }`}
              >
                {area}
              </Badge>
            ))}
          </div>
        </div>

        {gradeConfig.prerequisites.length > 0 && (
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
            <h5 className="text-blue-200 text-sm font-medium mb-2">Prerequisites from Previous Grades:</h5>
            <div className="space-y-1">
              {gradeConfig.prerequisites.slice(0, 3).map((prereq, index) => (
                <p key={index} className="text-blue-300 text-xs">
                  • Grade {prereq.gradeLevel}: {prereq.title}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GradeAwareContentGenerator;
