interface SubjectLessonPlan {
  id: string;
  title: string;
  subject: string;
  skillArea: string;
}

interface LessonListProps {
  lessons: SubjectLessonPlan[];
  onEdit: (lesson: SubjectLessonPlan) => void;
  onDelete: (lesson: SubjectLessonPlan) => void;
}

const LessonList = ({ lessons, onEdit, onDelete }: LessonListProps) => {
  return (
    <div className="space-y-2 p-4 border rounded">
      {lessons.length === 0 && <div className="text-sm opacity-80">No lessons yet.</div>}
      {lessons.map((lesson) => (
        <div key={lesson.id} className="flex items-center justify-between border p-2 rounded">
          <div>
            <div className="font-medium">{lesson.title}</div>
            <div className="text-xs opacity-70">{lesson.subject} • {lesson.skillArea}</div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded" onClick={() => onEdit(lesson)}>Edit</button>
            <button className="px-3 py-1 border rounded" onClick={() => onDelete(lesson)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonList;
