import React from 'react';

interface WorldClassTeachingTemplateProps {
  subject: string;
  studentName: string;
  gradeLevel: number;
  onStartLesson: () => void;
}

// Minimal teaching template to unblock build; can be enhanced later
const WorldClassTeachingTemplate: React.FC<WorldClassTeachingTemplateProps> = ({
  subject,
  studentName,
  gradeLevel,
  onStartLesson,
}) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">{subject} teaching template</h1>
        <p className="text-sm text-gray-600">Student: {studentName} • Grade {gradeLevel}</p>
      </header>
      <article className="space-y-3">
        <p className="text-gray-700">
          This is a lightweight placeholder for the World-Class Teaching Template. Click start to begin the optimized lesson.
        </p>
        <button
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={onStartLesson}
        >
          Start lesson
        </button>
      </article>
    </section>
  );
};

export default WorldClassTeachingTemplate;
