
import { supabase } from '@/integrations/supabase/client';

export interface KnowledgeComponent {
  id: string;
  name: string;
  subject: string;
  grade_level: number;
  difficulty_estimate: number;
  prerequisites: string[];
  description?: string;
}

class KnowledgeComponentService {
  async getKnowledgeComponents(filters?: {
    subject?: string;
    gradeLevel?: number;
    difficulty?: number;
  }): Promise<KnowledgeComponent[]> {
    console.log('🧠 Fetching knowledge components (stub implementation)');
    
    // Since knowledge_components table doesn't exist, return mock data
    const mockComponents: KnowledgeComponent[] = [
      {
        id: 'kc_math_g4_addition',
        name: 'Basic Addition',
        subject: 'math',
        grade_level: 4,
        difficulty_estimate: 0.3,
        prerequisites: [],
        description: 'Understanding basic addition concepts'
      },
      {
        id: 'kc_math_g4_multiplication',
        name: 'Multiplication Tables',
        subject: 'math',
        grade_level: 4,
        difficulty_estimate: 0.5,
        prerequisites: ['kc_math_g4_addition'],
        description: 'Learning multiplication tables'
      },
      {
        id: 'kc_math_g5_fractions',
        name: 'Basic Fractions',
        subject: 'math',
        grade_level: 5,
        difficulty_estimate: 0.6,
        prerequisites: ['kc_math_g4_multiplication'],
        description: 'Understanding fractions and their operations'
      }
    ];

    // Apply filters if provided
    let filteredComponents = mockComponents;
    
    if (filters?.subject) {
      filteredComponents = filteredComponents.filter(kc => kc.subject === filters.subject);
    }
    
    if (filters?.gradeLevel) {
      filteredComponents = filteredComponents.filter(kc => kc.grade_level === filters.gradeLevel);
    }
    
    const diff = filters?.difficulty;
    if (typeof diff === 'number') {
      filteredComponents = filteredComponents.filter(kc =>
        Math.abs(kc.difficulty_estimate - diff) <= 0.2
      );
    }

    console.log(`📚 Returning ${filteredComponents.length} knowledge components`);
    return filteredComponents;
  }

  async getKnowledgeComponentById(id: string): Promise<KnowledgeComponent | null> {
    console.log(`🔍 Fetching knowledge component: ${id}`);
    
    const components = await this.getKnowledgeComponents();
    const component = components.find(kc => kc.id === id);
    
    if (component) {
      console.log(`✅ Found knowledge component: ${component.name}`);
      return component;
    }
    
    console.log(`❌ Knowledge component not found: ${id}`);
    return null;
  }

  async getPrerequisites(kcId: string): Promise<KnowledgeComponent[]> {
    console.log(`📋 Fetching prerequisites for: ${kcId}`);
    
    const kc = await this.getKnowledgeComponentById(kcId);
    if (!kc || !kc.prerequisites.length) {
      return [];
    }
    
    const prerequisites = await Promise.all(
      kc.prerequisites.map(prereqId => this.getKnowledgeComponentById(prereqId))
    );
    
    return prerequisites.filter(Boolean) as KnowledgeComponent[];
  }
}

export default new KnowledgeComponentService();
