import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SubjectLessonPlan } from '../education/components/types/LessonTypes';

interface LessonListProps {
  lessons: SubjectLessonPlan[];
  onEdit: (lesson: SubjectLessonPlan) => void;
  onDelete: (lesson: SubjectLessonPlan) => void;
}

const LessonList: React.FC<LessonListProps> = ({ lessons, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <Card key={lesson.id}>
          <CardHeader>
            <CardTitle>{lesson.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <Button onClick={() => onEdit(lesson)}>Edit</Button>
              <Button onClick={() => onDelete(lesson)} variant="destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LessonList;
