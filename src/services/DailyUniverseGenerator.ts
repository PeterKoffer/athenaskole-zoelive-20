import { DailyUniverse } from '@/types/learning';
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import NELIESessionGenerator from './NELIESessionGenerator';

// Placeholder for student profile type
interface StudentProfile {
  gradeLevel?: number;
  learningPreferences?: string[];
  interests?: string[];
  preferredLearningStyle?: string;
}

class DailyUniverseGenerator {
  public async generate(studentProfile: StudentProfile): Promise<DailyUniverse> {
    const gradeLevel = studentProfile.gradeLevel || 4; // Default to grade 4 if not specified
    const preferredLearningStyle = studentProfile.preferredLearningStyle || 'mixed';

    const session = await NELIESessionGenerator.generateSession({
        gradeLevel,
        preferredLearningStyle,
        subjects: ['mathematics', 'english', 'science'],
        enableUniqueness: true,
    });

    const objectives = this.extractObjectivesFromSession(session);

    const universe: DailyUniverse = {
      id: `universe-${session.sessionId}`,
      title: 'A Day of Discovery',
      description: 'Explore a variety of subjects and challenges to expand your knowledge.',
      theme: 'interdisciplinary',
      objectives: objectives,
      learningAtoms: [], // This will be populated later
    };

    return universe;
  }

  private extractObjectivesFromSession(session: any): CurriculumNode[] {
    return session.lessons.map((lesson: any) => ({
        id: lesson.lesson.id,
        name: lesson.lesson.title,
        description: lesson.lesson.description,
        subjectName: lesson.lesson.subject,
        educationalLevel: String(lesson.lesson.gradeLevel),
    }));
  }
}

export const dailyUniverseGenerator = new DailyUniverseGenerator();
