import React from 'react';
import { SubjectLessonPlan, LessonActivity } from '@/components/education/components/types/LessonTypes';

interface LessonFormProps {
  lesson: SubjectLessonPlan;
  onLessonChange: (lesson: SubjectLessonPlan) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LessonForm: React.FC<LessonFormProps> = ({ lesson, onLessonChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 border rounded">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input className="mt-1 p-2 border rounded w-full" value={lesson.title} onChange={(e) => onLessonChange({ ...lesson, title: e.target.value })} />
      </div>
      <div className="flex gap-2">
        <input className="p-2 border rounded flex-1" placeholder="Subject" value={lesson.subject} onChange={(e) => onLessonChange({ ...lesson, subject: e.target.value })} />
        <input className="p-2 border rounded flex-1" placeholder="Skill Area" value={lesson.skillArea} onChange={(e) => onLessonChange({ ...lesson, skillArea: e.target.value })} />
      </div>
      <button type="submit" className="px-4 py-2 border rounded">Save Lesson</button>
    </form>
  );
};

export default LessonForm;
