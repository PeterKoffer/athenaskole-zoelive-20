import NELIESessionGenerator from './NELIESessionGenerator';
import { DailyUniverse } from '@/types/learning';
import { StudentProfile } from '@/types/studentProfile';

class NELIEEngine {
  private currentSession: any | null = null;
  private currentUniverse: DailyUniverse | null = null
  public async startSession(studentProfile: StudentProfile): Promise<any> {
    const sessionConfig = {
      gradeLevel: studentProfile.gradeLevel,
      preferredLearningStyle: studentProfile.learningStyle,
      subjects: ['mathematics', 'english', 'science'],
      enableUniqueness: true,
    };
    this.currentUniverse = await NELIESessionGenerator.generateSession(sessionConfig);
    this.currentSession = {
      id: `nelie-session-${Date.now()}`,
      studentProfile,
      startTime: new Date(),
      status: 'active',
    };
    return this.currentSession;
  }

  public getCurrentUniverse(): DailyUniverse | null {
    return this.currentUniverse;
  }
}

export const nelieEngine = new NELIEEngine();
