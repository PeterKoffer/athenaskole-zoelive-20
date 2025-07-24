
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Clock, Star } from 'lucide-react';
import { toast } from 'sonner';
import MultiSubjectLessonTemplate from './MultiSubjectLessonTemplate';
import { UniversalContentGenerator } from '../components/utils/universalContentGenerator';

interface UniversalLessonTemplateProps {
  subject: string;
  skillArea: string;
  studentName?: string;
  onComplete: () => void;
  onBack: () => void;
}

const UniversalLessonTemplate: React.FC<UniversalLessonTemplateProps> = ({
  subject,
  skillArea,
  studentName,
  onComplete,
  onBack
}) => {
  const [showMultiSubject, setShowMultiSubject] = useState(false);
  const [gradeLevel, setGradeLevel] = useState(3); // Default grade level

  // If user wants multi-subject lesson, show the comprehensive template
  if (showMultiSubject) {
    return (
      <MultiSubjectLessonTemplate
        topic={skillArea}
        gradeLevel={gradeLevel}
        onComplete={(score, achievements) => {
          toast.success('Multi-subject lesson completed!', {
            description: `Score: ${score} points, Achievements: ${achievements.length}`
          });
          onComplete();
        }}
        onBack={() => setShowMultiSubject(false)}
      />
    );
  }

  // Generate lesson content
  const lessonActivities = UniversalContentGenerator.generateEngagingLesson(subject, skillArea, gradeLevel);
  const totalDuration = lessonActivities.reduce((sum, activity) => sum + activity.duration, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {studentName ? `${studentName}'s ` : ''}Learning Journey
          </h1>
          <p className="text-muted-foreground">
            {subject.charAt(0).toUpperCase() + subject.slice(1)} • {skillArea}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{Math.round(totalDuration / 60)} min</span>
        </div>
      </div>

      {/* Lesson Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Choose Your Learning Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Single Subject Option */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50">
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <div className="text-4xl mb-2">📚</div>
                  <h3 className="font-semibold">Focused Subject Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    Deep dive into {subject} with specialized activities for {skillArea}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary">{subject}</Badge>
                    <Badge variant="outline">{Math.round(totalDuration / 60)} min</Badge>
                  </div>
                  <Button 
                    onClick={() => {
                      toast.info('Starting focused lesson...', {
                        description: `Exploring ${skillArea} in ${subject}`
                      });
                      // For now, complete immediately as this is a demo
                      setTimeout(() => onComplete(), 2000);
                    }}
                    className="w-full"
                  >
                    Start Focused Lesson
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Multi-Subject Option */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50">
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <div className="text-4xl mb-2">🌟</div>
                  <h3 className="font-semibold">Multi-Subject Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore {skillArea} through Math, Science, Language Arts, Social Studies, and Art
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="default">6 Subjects</Badge>
                    <Badge variant="outline">~2 hours</Badge>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      <Star className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                  <Button 
                    onClick={() => setShowMultiSubject(true)}
                    className="w-full"
                    variant="default"
                  >
                    Start Multi-Subject Journey
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center text-sm text-muted-foreground mt-4">
            💡 Multi-subject learning helps you see connections between different areas of knowledge!
          </div>
        </CardContent>
      </Card>

      {/* Grade Level Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Customize Your Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Grade Level</label>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((grade) => (
                  <Button
                    key={grade}
                    variant={gradeLevel === grade ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGradeLevel(grade)}
                  >
                    Grade {grade}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview of Activities */}
      <Card>
        <CardHeader>
          <CardTitle>What You'll Learn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lessonActivities.map((activity, index) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(activity.duration / 60)} min
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversalLessonTemplate;
