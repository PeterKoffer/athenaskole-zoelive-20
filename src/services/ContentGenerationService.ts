import curriculumIndex from '../data/unified-curriculum-index.json';
import { CurriculumNode } from '../types/curriculum/CurriculumNode';

class ContentGenerationService {
  private curriculum: { [key: string]: CurriculumNode } = curriculumIndex;

  public getCurriculumNodeById(id: string): CurriculumNode | undefined {
    return this.curriculum[id];
  }

  public findNodesBySubject(subject: string): CurriculumNode[] {
    return Object.values(this.curriculum).filter(node => node.subjectName === subject);
  }

  public findNodesByGrade(grade: string): CurriculumNode[] {
    return Object.values(this.curriculum).filter(node => node.educationalLevel === grade);
  }

  public async generateDailyUniverse(studentProfile: any): Promise<any> {
    // In a real app, we'd get the school and teacher IDs from the student's profile
    const schoolId = studentProfile.school_id || 'some-default-school-id';
    const teacherId = studentProfile.teacher_id || 'some-default-teacher-id';

    const schoolPrefs = await preferencesService.getSchoolPreferences(schoolId);
    const teacherPrefs = await preferencesService.getTeacherPreferences(teacherId);

    const finalWeights = {
      ...schoolPrefs?.subject_weights,
      ...teacherPrefs?.subject_weights,
      ...teacherPrefs?.weekly_emphasis,
    };

    const learningObjectives = Object.values(this.curriculum).filter(
      node => node.nodeType === 'learning_objective'
    );

    // This is a simplified weighting algorithm. A real implementation would be more complex.
    const weightedObjectives = learningObjectives.map(obj => {
      const weight = finalWeights[obj.subject] || 1;
      return { ...obj, weight };
    });

    const sortedObjectives = weightedObjectives.sort((a, b) => b.weight - a.weight);

    const selectedObjectives = sortedObjectives.slice(0, 5);

    return {
      title: "A Personalized Day of Adventure!",
      description: "Today, you'll embark on a journey of learning and discovery, tailored to your school's and teacher's focus. Complete these tasks to help your community and earn rewards!",
      objectives: selectedObjectives,
    };
  }
}

export const contentGenerationService = new ContentGenerationService();
