import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SubjectLessonPlan } from '../education/components/types/LessonTypes';

interface LessonFormProps {
  lesson: SubjectLessonPlan;
  onLessonChange: (lesson: SubjectLessonPlan) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LessonForm: React.FC<LessonFormProps> = ({ lesson, onLessonChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Edit Lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                value={lesson.title}
                onChange={(e) => onLessonChange({ ...lesson, title: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="subject">Subject</label>
              <Input
                id="subject"
                value={lesson.subject}
                onChange={(e) => onLessonChange({ ...lesson, subject: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="gradeLevel">Grade Level</label>
              <Input
                id="gradeLevel"
                type="number"
                value={lesson.gradeLevel}
                onChange={(e) => onLessonChange({ ...lesson, gradeLevel: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label htmlFor="overview">Overview</label>
              <Textarea
                id="overview"
                value={lesson.overview}
                onChange={(e) => onLessonChange({ ...lesson, overview: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Button type="submit" className="mt-4">Save Lesson</Button>
    </form>
  );
};

export default LessonForm;
