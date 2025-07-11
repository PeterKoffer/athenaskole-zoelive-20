
import { CurriculumService, ICurriculumService } from './CurriculumService';
import { MockCurriculumService } from './MockCurriculumService';

export type CurriculumServiceType = 'unified' | 'mock' | 'enhanced';

export interface CurriculumServiceConfig {
  type: CurriculumServiceType;
  dataSource?: 'mock' | 'api' | 'hybrid';
  enableAIContext?: boolean;
  enableCaching?: boolean;
}

export class CurriculumServiceFactory {
  private static instances: Map<string, ICurriculumService> = new Map();

  static create(config: CurriculumServiceConfig): ICurriculumService {
    const key = JSON.stringify(config);
    
    if (this.instances.has(key)) {
      return this.instances.get(key)!;
    }

    let service: ICurriculumService;

    switch (config.type) {
      case 'unified':
        service = new CurriculumService();
        break;
      case 'mock':
        service = new MockCurriculumService();
        break;
      case 'enhanced':
        // Future: Enhanced service with additional capabilities
        service = new CurriculumService();
        break;
      default:
        service = new CurriculumService();
    }

    this.instances.set(key, service);
    return service;
  }

  static getDefault(): ICurriculumService {
    return this.create({ type: 'unified', enableAIContext: true });
  }

  static clearCache(): void {
    this.instances.clear();
  }
}

// Export the default instance
export const defaultCurriculumService = CurriculumServiceFactory.getDefault();
