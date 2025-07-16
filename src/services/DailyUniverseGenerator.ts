import { CurriculumNode } from '../types/curriculum/CurriculumNode';
import { OpenAIService } from './OpenAIService';

interface DailyUniverse {
    title: string;
    description: string;
    objectives: CurriculumNode[];
}

class DailyUniverseGeneratorService {
    async generate(studentProfile: any): Promise<DailyUniverse> {
        const openAIService = OpenAIService.getInstance();
        const prompt = `Generate a daily universe for a student with the following profile: ${JSON.stringify(studentProfile)}. The universe should have a title, a description, and a list of three learning objectives. The learning objectives should be in the following format: { "id": "string", "nodeType": "learning_objective", "name": "string", "description": "string", "subjectName": "string", "educationalLevel": "string" }`;
        const universe = await openAIService.generateUniverse(prompt);
        return universe;
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
