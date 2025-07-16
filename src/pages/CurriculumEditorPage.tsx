import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import LessonForm from '../components/curriculum/LessonForm';
import LessonList from '../components/curriculum/LessonList';
import { SubjectLessonPlan } from '../components/education/components/types/LessonTypes';

const CurriculumEditorPage: React.FC = () => {
  const [lessons, setLessons] = useState<SubjectLessonPlan[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<SubjectLessonPlan | null>(null);

  const handleCreateLesson = () => {
    setSelectedLesson({
      id: `lesson-${Date.now()}`,
      title: 'New Lesson',
      subject: 'mathematics',
      skillArea: 'addition',
      gradeLevel: 1,
      activities: [],
      estimatedDuration: 600,
      learningObjectives: [],
    });
  };

  const handleLessonChange = (newLesson: SubjectLessonPlan) => {
    setSelectedLesson(newLesson);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLesson) {
      const existingLessonIndex = lessons.findIndex(
        (lesson) => lesson.id === selectedLesson.id
      );
      if (existingLessonIndex !== -1) {
        const newLessons = [...lessons];
        newLessons[existingLessonIndex] = selectedLesson;
        setLessons(newLessons);
      } else {
        setLessons([...lessons, selectedLesson]);
      }
      setSelectedLesson(null);
    }
  };

  const handleEdit = (lesson: SubjectLessonPlan) => {
    setSelectedLesson(lesson);
  };

  const handleDelete = (lessonToDelete: SubjectLessonPlan) => {
    setLessons(lessons.filter((lesson) => lesson.id !== lessonToDelete.id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 space-y-8">
        <h1 className="text-4xl font-bold">Curriculum Editor</h1>
        <p className="text-xl text-muted-foreground">
          Create and edit lessons for your students.
        </p>
        <Button onClick={handleCreateLesson}>Create New Lesson</Button>
        {selectedLesson ? (
          <LessonForm
            lesson={selectedLesson}
            onLessonChange={handleLessonChange}
            onSubmit={handleSubmit}
          />
        ) : (
          <LessonList
            lessons={lessons}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default CurriculumEditorPage;
