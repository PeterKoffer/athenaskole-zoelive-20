import type { FormEvent } from 'react';

interface SubjectLessonPlan {
  id: string;
  title: string;
  subject: string;
  skillArea: string;
}

interface LessonFormProps {
  lesson: SubjectLessonPlan;
  onLessonChange: (lesson: SubjectLessonPlan) => void;
  onSubmit: (e: FormEvent) => void;
}

const LessonForm = ({ lesson, onLessonChange, onSubmit }: LessonFormProps) => {
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
