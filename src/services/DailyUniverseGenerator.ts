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
  private getSubjectsForInterests(interests: string[]): string[] {
    // In a real application, this would be a more sophisticated mapping.
    const subjectMap = {
      'space': ['science', 'mathematics'],
      'dinosaurs': ['science', 'history'],
      'art': ['creativeArts'],
      'music': ['music'],
      'sports': ['physicalEducation'],
      'coding': ['computerScience'],
    };

    const subjects = new Set<string>();
    for (const interest of interests) {
      const mappedSubjects = subjectMap[interest];
      if (mappedSubjects) {
        for (const subject of mappedSubjects) {
          subjects.add(subject);
        }
      }
    }

    // If no interests match, return a default set of subjects.
    if (subjects.size === 0) {
      return ['mathematics', 'english', 'science'];
    }

    return Array.from(subjects);
  }

  private getDifficultyForSubject(subject: string, progress: any): number {
    // In a real application, this would be a more sophisticated calculation.
    const subjectProgress = progress[subject];
    if (subjectProgress) {
      const skillLevels = Object.values(subjectProgress) as number[];
      const averageSkillLevel = skillLevels.reduce((a, b) => a + b, 0) / skillLevels.length;
      if (averageSkillLevel > 0.8) {
        return 3; // Hard
      } else if (averageSkillLevel > 0.5) {
        return 2; // Medium
      }
    }
    return 1; // Easy
  }

  public async generate(studentProfile: StudentProfile): Promise<DailyUniverse> {
    const gradeLevel = studentProfile.gradeLevel || 4; // Default to grade 4 if not specified
    const preferredLearningStyle = studentProfile.preferredLearningStyle || 'mixed';
    const subjects = this.getSubjectsForInterests(studentProfile.interests || []);
    const difficulty = this.getDifficultyForSubject(subjects[0], studentProfile.progress || {});

    const session = await NELIESessionGenerator.generateSession({
        gradeLevel,
        preferredLearningStyle,
        subjects,
        enableUniqueness: true,
        difficulty,
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
