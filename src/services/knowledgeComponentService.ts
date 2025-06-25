// src/services/knowledgeComponentService.ts

import {
  KnowledgeComponent,
  IKnowledgeComponentService,
} from '@/types/knowledgeComponent';
// Eventually, this might come from an API or a more robust data source.
// For now, we load it from a local JSON file.
import mockKcsData from '@/data/mockKnowledgeComponents.json';

class KnowledgeComponentService implements IKnowledgeComponentService {
  private kcs: KnowledgeComponent[] = [];
  private kcsById: Map<string, KnowledgeComponent> = new Map();
  private isInitialized = false;

  constructor() {
    this.loadKcs();
  }

  private async loadKcs(): Promise<void> {
    // In a real application, this might fetch from a database or API
    // For now, we're using the imported JSON.
    // Simulate async loading
    await Promise.resolve();

    this.kcs = mockKcsData as KnowledgeComponent[];
    this.kcs.forEach(kc => this.kcsById.set(kc.id, kc));
    this.isInitialized = true;
    console.log(`KnowledgeComponentService: Loaded ${this.kcs.length} KCs.`);
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      // This is a simple busy-wait, in a real app use a more robust initialization pattern
      // or ensure loadKcs is called and awaited in the constructor properly if it were truly async.
      // For current mock data setup, this is mostly a formality.
      let attempts = 0;
      while(!this.isInitialized && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 50));
        attempts++;
      }
      if (!this.isInitialized) {
        console.error("KnowledgeComponentService: Failed to initialize after multiple attempts.");
        // Potentially throw an error or handle appropriately
      }
    }
  }

  async getKcById(id: string): Promise<KnowledgeComponent | undefined> {
    await this.ensureInitialized();
    return this.kcsById.get(id);
  }

  async getKcsByIds(ids: string[]): Promise<KnowledgeComponent[]> {
    await this.ensureInitialized();
    return ids.map(id => this.kcsById.get(id)).filter(kc => kc !== undefined) as KnowledgeComponent[];
  }

  async getKcsBySubjectAndGrade(subject: string, gradeLevel: number): Promise<KnowledgeComponent[]> {
    await this.ensureInitialized();
    return this.kcs.filter(kc =>
      kc.subject.toLowerCase() === subject.toLowerCase() &&
      kc.gradeLevels.includes(gradeLevel)
    );
  }

  async getPrerequisiteKcs(kcId: string): Promise<KnowledgeComponent[]> {
    await this.ensureInitialized();
    const kc = this.kcsById.get(kcId);
    if (!kc || !kc.prerequisiteKcs || kc.prerequisiteKcs.length === 0) {
      return [];
    }
    return this.getKcsByIds(kc.prerequisiteKcs);
  }

  async searchKcs(query: string): Promise<KnowledgeComponent[]> {
    await this.ensureInitialized();
    const lowerQuery = query.toLowerCase();
    if (!lowerQuery) return [];

    return this.kcs.filter(kc =>
      kc.name.toLowerCase().includes(lowerQuery) ||
      kc.description?.toLowerCase().includes(lowerQuery) ||
      kc.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      kc.id.toLowerCase().includes(lowerQuery)
    );
  }

  // Placeholder for future methods (CRUD operations)
  // async addKc(kcData: Omit<KnowledgeComponent, 'id'>): Promise<KnowledgeComponent> {
  //   // Implementation would involve generating an ID, adding to the list/map,
  //   // and potentially persisting to a backend.
  //   throw new Error("Method not implemented.");
  // }
  // async updateKc(id: string, updates: Partial<KnowledgeComponent>): Promise<KnowledgeComponent | undefined> {
  //   throw new Error("Method not implemented.");
  // }
  // async deleteKc(id: string): Promise<boolean> {
  //   throw new Error("Method not implemented.");
  // }
}

// Export a singleton instance of the service
const knowledgeComponentService = new KnowledgeComponentService();
export default knowledgeComponentService;

// Example Usage:
// import knowledgeComponentService from '@/services/knowledgeComponentService';
//
// async function example() {
//   const kc = await knowledgeComponentService.getKcById('kc_math_g4_add_fractions_likedenom');
//   console.log('Found KC:', kc);
//
//   const mathKcsGrade4 = await knowledgeComponentService.getKcsBySubjectAndGrade('Mathematics', 4);
//   console.log('Math KCs for Grade 4:', mathKcsGrade4);
//
//   if (kc) {
//     const prereqs = await knowledgeComponentService.getPrerequisiteKcs(kc.id);
//     console.log(`Prerequisites for ${kc.name}:`, prereqs);
//   }
//
//   const searchResults = await knowledgeComponentService.searchKcs('fraction');
//   console.log('Search results for "fraction":', searchResults);
// }
// example();
