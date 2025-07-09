
// Stub implementation for knowledge component service
// Note: This replaces database queries to non-existent knowledge_components table

export interface KnowledgeComponent {
  id: string;
  name: string;
  subject: string;
  gradeLevels: number[];
  difficulty_estimate: number;
}

export const knowledgeComponentService = {
  async getAllKnowledgeComponents(): Promise<KnowledgeComponent[]> {
    console.log('🧠 Getting all knowledge components (stub implementation)');
    
    // Mock knowledge components
    return [
      {
        id: 'kc_math_g4_add_fractions',
        name: 'Adding Fractions with Like Denominators',
        subject: 'Mathematics',
        gradeLevels: [4],
        difficulty_estimate: 0.4
      },
      {
        id: 'kc_math_g5_multiply_decimals',
        name: 'Multiplying Decimal Numbers',
        subject: 'Mathematics',
        gradeLevels: [5],
        difficulty_estimate: 0.6
      }
    ];
  },

  async getKnowledgeComponentById(id: string): Promise<KnowledgeComponent | null> {
    console.log('🔍 Getting knowledge component by ID (stub implementation):', id);
    
    const allKcs = await this.getAllKnowledgeComponents();
    return allKcs.find(kc => kc.id === id) || null;
  }
};
