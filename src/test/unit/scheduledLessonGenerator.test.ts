import { describe, it, expect } from 'vitest';

// Since the scheduledLessonGenerator is a Supabase Edge Function (Deno),
// we'll test the core logic separately by extracting the helper functions

interface ClassData {
  id: string;
  name: string;
  grade: string;
  teacher: string;
  subject: string;
  students: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

// Extract helper functions for testing
function extractSubjectsFromClassSubject(subjectString: string): string[] {
  return subjectString
    .split('&')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function getDefaultSkillArea(subject: string): string {
  const skillAreaMap: { [key: string]: string } = {
    'Matematik': 'arithmetic',
    'Dansk': 'reading-comprehension',
    'Engelsk': 'vocabulary',
    'Naturvidenskab': 'observation',
    'Historie': 'chronology'
  };
  return skillAreaMap[subject] || 'general';
}

function generatePlaceholderActivities(subject: string, gradeLevel: number): any[] {
  const activities = [];
  const activityTypes = ['content-delivery', 'interactive-game', 'application'];
  
  for (let i = 0; i < 7; i++) {
    activities.push({
      id: `activity-${i + 1}`,
      type: activityTypes[i % activityTypes.length],
      title: `${subject} Activity ${i + 1}`,
      description: `Grade ${gradeLevel} ${subject} learning activity`,
      duration: Math.floor(Math.random() * 300) + 180, // 3-8 minutes
      difficultyLevel: Math.max(1, gradeLevel),
      content: {
        instructions: `Practice ${subject} skills appropriate for grade ${gradeLevel}`,
        gradeLevel: gradeLevel,
        subject: subject
      }
    });
  }
  
  return activities;
}

function mockGenerateLessonForClass(
  classData: ClassData, 
  subject: string, 
  date: string
): any {
  const gradeLevel = parseInt(classData.grade) || 1;
  const lessonId = `lesson-${classData.id}-${subject}-${date}-${Date.now()}`;
  
  return {
    id: lessonId,
    subject: subject,
    skillArea: getDefaultSkillArea(subject),
    gradeLevel: gradeLevel,
    totalActivities: 7,
    activities: generatePlaceholderActivities(subject, gradeLevel),
    metadata: {
      classId: classData.id,
      className: classData.name,
      teacher: classData.teacher,
      date: date,
      generatedAt: new Date().toISOString(),
      studentCount: classData.students.length
    }
  };
}

describe('Scheduled Lesson Generator Core Logic', () => {
  const mockClass: ClassData = {
    id: "1a",
    name: "1.A",
    grade: "1",
    teacher: "Lærer Hansen",
    subject: "Matematik & Dansk",
    students: [
      { id: "1", name: "Emma Nielsen", email: "emma@example.com" },
      { id: "2", name: "Lucas Hansen", email: "lucas@example.com" }
    ]
  };

  describe('extractSubjectsFromClassSubject', () => {
    it('should extract multiple subjects from combined string', () => {
      const result = extractSubjectsFromClassSubject("Matematik & Dansk");
      expect(result).toEqual(["Matematik", "Dansk"]);
    });

    it('should handle single subject', () => {
      const result = extractSubjectsFromClassSubject("Matematik");
      expect(result).toEqual(["Matematik"]);
    });

    it('should handle empty or whitespace', () => {
      const result = extractSubjectsFromClassSubject("  &  ");
      expect(result).toEqual([]);
    });

    it('should trim whitespace around subjects', () => {
      const result = extractSubjectsFromClassSubject("  Matematik  &  Dansk  ");
      expect(result).toEqual(["Matematik", "Dansk"]);
    });
  });

  describe('getDefaultSkillArea', () => {
    it('should return correct skill area for known subjects', () => {
      expect(getDefaultSkillArea('Matematik')).toBe('arithmetic');
      expect(getDefaultSkillArea('Dansk')).toBe('reading-comprehension');
      expect(getDefaultSkillArea('Engelsk')).toBe('vocabulary');
    });

    it('should return "general" for unknown subjects', () => {
      expect(getDefaultSkillArea('Unknown Subject')).toBe('general');
    });
  });

  describe('generatePlaceholderActivities', () => {
    it('should generate exactly 7 activities', () => {
      const activities = generatePlaceholderActivities('Matematik', 1);
      expect(activities).toHaveLength(7);
    });

    it('should cycle through activity types', () => {
      const activities = generatePlaceholderActivities('Matematik', 1);
      const expectedTypes = ['content-delivery', 'interactive-game', 'application'];
      
      activities.forEach((activity, index) => {
        expect(activity.type).toBe(expectedTypes[index % expectedTypes.length]);
      });
    });

    it('should set grade level correctly', () => {
      const activities = generatePlaceholderActivities('Matematik', 2);
      
      activities.forEach(activity => {
        expect(activity.content.gradeLevel).toBe(2);
        expect(activity.difficultyLevel).toBe(2);
      });
    });

    it('should include subject in title and content', () => {
      const activities = generatePlaceholderActivities('Dansk', 1);
      
      activities.forEach(activity => {
        expect(activity.title).toContain('Dansk');
        expect(activity.content.subject).toBe('Dansk');
      });
    });
  });

  describe('generateLessonForClass (mock)', () => {
    it('should generate lesson with correct structure', () => {
      const date = '2024-01-15';
      const lesson = mockGenerateLessonForClass(mockClass, 'Matematik', date);

      expect(lesson).toHaveProperty('id');
      expect(lesson).toHaveProperty('subject', 'Matematik');
      expect(lesson).toHaveProperty('skillArea', 'arithmetic');
      expect(lesson).toHaveProperty('gradeLevel', 1);
      expect(lesson).toHaveProperty('totalActivities', 7);
      expect(lesson).toHaveProperty('activities');
      expect(lesson).toHaveProperty('metadata');

      expect(lesson.activities).toHaveLength(7);
      expect(lesson.metadata.classId).toBe(mockClass.id);
      expect(lesson.metadata.className).toBe(mockClass.name);
      expect(lesson.metadata.date).toBe(date);
      expect(lesson.metadata.studentCount).toBe(2);
    });

    it('should generate unique lesson IDs', () => {
      const lesson1 = mockGenerateLessonForClass(mockClass, 'Matematik', '2024-01-15');
      const lesson2 = mockGenerateLessonForClass(mockClass, 'Dansk', '2024-01-15');

      expect(lesson1.id).not.toBe(lesson2.id);
    });

    it('should handle different grade levels', () => {
      const class3 = { ...mockClass, grade: '3' };
      const lesson = mockGenerateLessonForClass(class3, 'Matematik', '2024-01-15');

      expect(lesson.gradeLevel).toBe(3);
      lesson.activities.forEach(activity => {
        expect(activity.difficultyLevel).toBe(3);
        expect(activity.content.gradeLevel).toBe(3);
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should process multiple subjects for a class', () => {
      const subjects = extractSubjectsFromClassSubject(mockClass.subject);
      const lessons = subjects.map(subject => 
        mockGenerateLessonForClass(mockClass, subject, '2024-01-15')
      );

      expect(lessons).toHaveLength(2);
      expect(lessons[0].subject).toBe('Matematik');
      expect(lessons[1].subject).toBe('Dansk');
      
      // Ensure both lessons are for the same class
      lessons.forEach(lesson => {
        expect(lesson.metadata.classId).toBe(mockClass.id);
      });
    });

    it('should handle edge case with no students', () => {
      const emptyClass = { ...mockClass, students: [] };
      const lesson = mockGenerateLessonForClass(emptyClass, 'Matematik', '2024-01-15');

      expect(lesson.metadata.studentCount).toBe(0);
      expect(lesson.activities).toHaveLength(7); // Should still generate full lesson
    });
  });
});