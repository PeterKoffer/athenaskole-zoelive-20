import { NELIESessionGenerator } from './NELIESessionGenerator';
import { DailyUniverse } from '@/types/learning';

class NELIEEngine {
  private currentSession: any | null = null;
  private currentUniverse: DailyUniverse | null = null;

  public async startSession(studentProfile: any): Promise<any> {
    this.currentUniverse = await NELIESessionGenerator.generateSession(studentProfile);
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
