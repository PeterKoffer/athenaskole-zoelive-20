import { CurriculumNode } from '../types/curriculum/CurriculumNode';

interface DailyUniverse {
    title: string;
    description: string;
    objectives: CurriculumNode[];
}

class DailyUniverseGeneratorService {
    async generate(studentProfile: any): Promise<DailyUniverse> {
        // Mock implementation for now
        return {
            title: 'Daily Learning Adventure',
            description: 'Explore new concepts through interactive learning',
            objectives: [
                {
                    id: '1',
                    nodeType: 'learning_objective',
                    name: 'Introduction to Algebra',
                    description: 'Learn the basics of algebraic expressions and equations.',
                    subjectName: 'Mathematics',
                    educationalLevel: 'Grade 7',
                },
                {
                    id: '2',
                    nodeType: 'learning_objective',
                    name: 'The Solar System',
                    description: 'Explore the planets, moons, and other celestial bodies in our solar system.',
                    subjectName: 'Science',
                    educationalLevel: 'Grade 6',
                },
                {
                    id: '3',
                    nodeType: 'learning_objective',
                    name: 'Creative Writing',
                    description: 'Learn how to write engaging stories and poems.',
                    subjectName: 'English',
                    educationalLevel: 'Grade 8',
                },
            ]
        };
    }
    return 1; // Easy
  }

  public async generate(studentProfile: any): Promise<DailyUniverse> {

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
        userId: studentProfile.id,
        schoolId: studentProfile.schoolId,
        teacherId: studentProfile.teacherId,

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

export const dailyUniverseGenerator = new DailyUniverseGeneratorService();
