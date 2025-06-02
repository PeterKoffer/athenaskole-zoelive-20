
import { useMemo } from "react";
import { MessageGroup } from "@/types/communication";

interface DynamicGroupGeneratorProps {
  selectedGrade: string;
  selectedClass: string;
  originalGroups: MessageGroup[];
}

export const useDynamicGroups = ({ selectedGrade, selectedClass, originalGroups }: DynamicGroupGeneratorProps) => {
  return useMemo(() => {
    if (!selectedGrade || !selectedClass) {
      return originalGroups; // Return original groups if no selection
    }

    const classId = `${selectedGrade}${selectedClass}`;
    const className = `${selectedGrade}.${selectedClass.toUpperCase()}`;

    return [
      {
        id: `class_${classId}`,
        name: `${className} - Students`,
        description: `All students in class ${className}`,
        type: 'class' as const,
        classId: classId,
        icon: 'GraduationCap',
        participants: [
          { id: '1', name: 'Sample Student 1', role: 'student' as const, email: 'student1@example.com' },
          { id: '2', name: 'Sample Student 2', role: 'student' as const, email: 'student2@example.com' }
        ]
      },
      {
        id: `class_${classId}_teachers`,
        name: `${className} - Teachers`,
        description: `Teachers for class ${className}`,
        type: 'class_teachers' as const,
        classId: classId,
        icon: 'BookOpen',
        participants: [
          { id: 'teacher1', name: `Teacher for ${className}`, role: 'teacher' as const, email: `teacher${classId}@school.dk` }
        ]
      },
      {
        id: `class_${classId}_all`,
        name: `${className} - Everyone`,
        description: `Students, teachers and parents for class ${className}`,
        type: 'class_all' as const,
        classId: classId,
        icon: 'School',
        participants: [
          { id: '1', name: 'Sample Student 1', role: 'student' as const, email: 'student1@example.com' },
          { id: '2', name: 'Sample Student 2', role: 'student' as const, email: 'student2@example.com' },
          { id: 'teacher1', name: `Teacher for ${className}`, role: 'teacher' as const, email: `teacher${classId}@school.dk` },
          { id: 'parent1', name: 'Parent 1', role: 'parent' as const, email: 'parent1@example.com' },
          { id: 'parent2', name: 'Parent 2', role: 'parent' as const, email: 'parent2@example.com' }
        ]
      },
      {
        id: 'school_all',
        name: 'Entire School',
        description: 'All users in the school',
        type: 'school_all' as const,
        icon: 'School',
        participants: [
          { id: '1', name: 'Sample Student', role: 'student' as const, email: 'student@example.com' },
          { id: 'teacher1', name: 'Sample Teacher', role: 'teacher' as const, email: 'teacher@school.dk' },
          { id: 'admin1', name: 'Principal', role: 'school_leader' as const, email: 'principal@school.dk' }
        ]
      }
    ];
  }, [selectedGrade, selectedClass, originalGroups]);
};
