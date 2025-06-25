// src/services/contentAtomRepository.ts

import {
  ContentAtom,
  ContentAtomType,
  IContentAtomRepository,
} from '@/types/contentAtom';
import mockContentAtomsData from '@/data/mockContentAtoms.json';

class ContentAtomRepository implements IContentAtomRepository {
  private atoms: ContentAtom[] = [];
  private atomsById: Map<string, ContentAtom> = new Map();
  private isInitialized = false;

  constructor() {
    this.loadAtoms();
  }

  private async loadAtoms(): Promise<void> {
    // Simulate async loading, mirroring KnowledgeComponentService
    await Promise.resolve();

    this.atoms = mockContentAtomsData as ContentAtom[]; // Type assertion
    this.atoms.forEach(atom => this.atomsById.set(atom.id, atom));
    this.isInitialized = true;
    console.log(`ContentAtomRepository: Loaded ${this.atoms.length} content atoms.`);
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      // Simple busy-wait for mock data loading, similar to KnowledgeComponentService
      let attempts = 0;
      while(!this.isInitialized && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 50));
        attempts++;
      }
      if (!this.isInitialized) {
        console.error("ContentAtomRepository: Failed to initialize after multiple attempts.");
      }
    }
  }

  async getAtomById(id: string): Promise<ContentAtom | undefined> {
    await this.ensureInitialized();
    return this.atomsById.get(id);
  }

  async getAtomsByIds(ids: string[]): Promise<ContentAtom[]> {
    await this.ensureInitialized();
    return ids.map(id => this.atomsById.get(id)).filter(atom => atom !== undefined) as ContentAtom[];
  }

  async getAtomsByKcId(kcId: string): Promise<ContentAtom[]> {
    await this.ensureInitialized();
    return this.atoms.filter(atom => atom.knowledgeComponentIds.includes(kcId));
  }

  async getAtomsByKcIds(kcIds: string[]): Promise<ContentAtom[]> {
    await this.ensureInitialized();
    if (kcIds.length === 0) return [];
    const kcIdSet = new Set(kcIds);
    return this.atoms.filter(atom =>
      atom.knowledgeComponentIds.some(kcId => kcIdSet.has(kcId))
    );
  }

  async getAtomsByType(atomType: ContentAtomType): Promise<ContentAtom[]> {
    await this.ensureInitialized();
    return this.atoms.filter(atom => atom.atomType === atomType);
  }

  async findAtoms(filter: {
    kcId?: string;
    atomType?: ContentAtomType;
    tags?: string[]; // For metadata tags like worldview or cultural context
    difficultyMin?: number;
    difficultyMax?: number;
  }): Promise<ContentAtom[]> {
    await this.ensureInitialized();
    return this.atoms.filter(atom => {
      if (filter.kcId && !atom.knowledgeComponentIds.includes(filter.kcId)) {
        return false;
      }
      if (filter.atomType && atom.atomType !== filter.atomType) {
        return false;
      }
      if (filter.tags && filter.tags.length > 0) {
        const metadataTags = [
          ...(atom.metadata.worldviewTags || []),
          ...(atom.metadata.culturalContextTags || [])
        ];
        // Check if all filter tags are present in the atom's combined metadata tags
        if (!filter.tags.every(tag => metadataTags.some(mt => mt.toLowerCase() === tag.toLowerCase()))) {
          return false;
        }
      }
      if (filter.difficultyMin !== undefined && (atom.metadata.difficulty === undefined || atom.metadata.difficulty < filter.difficultyMin)) {
        return false;
      }
      if (filter.difficultyMax !== undefined && (atom.metadata.difficulty === undefined || atom.metadata.difficulty > filter.difficultyMax)) {
        return false;
      }
      return true;
    });
  }

  // Placeholder for future CRUD methods that would interact with Supabase
  // async addAtom(atomData: Omit<ContentAtom, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentAtom> {
  //   throw new Error("Method not implemented.");
  // }
  // async updateAtom(id: string, updates: Partial<ContentAtom>): Promise<ContentAtom | undefined> {
  //   throw new Error("Method not implemented.");
  // }
  // async deleteAtom(id: string): Promise<boolean> {
  //   throw new Error("Method not implemented.");
  // }
}

// Export a singleton instance of the service
const contentAtomRepository = new ContentAtomRepository();
export default contentAtomRepository;

// Example Usage (for testing in console or other services):
// import contentAtomRepository from '@/services/contentAtomRepository';
//
// async function exampleAtomOps() {
//   console.log("Testing ContentAtomRepository...");
//
//   const atom = await contentAtomRepository.getAtomById('atom_expl_fraction_intro_1');
//   console.log('Found Atom by ID:', atom);
//
//   const atomsForKc = await contentAtomRepository.getAtomsByKcId('kc_math_g3_understand_fractions_unit');
//   console.log('Atoms for KC kc_math_g3_understand_fractions_unit:', atomsForKc.length, atomsForKc.map(a=>a.id));
//
//   const imageAtoms = await contentAtomRepository.getAtomsByType(ContentAtomType.IMAGE);
//   console.log('Image Atoms:', imageAtoms.length, imageAtoms.map(a=>a.id));
//
//   const filteredAtoms = await contentAtomRepository.findAtoms({
//     kcId: 'kc_math_g3_understand_fractions_unit',
//     atomType: ContentAtomType.QUESTION_MULTIPLE_CHOICE,
//     difficultyMax: 0.5
//   });
//   console.log('Filtered Atoms (KC unit fraction, QMC, diff <= 0.5):', filteredAtoms.length, filteredAtoms.map(a=>a.id));
//
//   const worldviewFiltered = await contentAtomRepository.findAtoms({tags: ["Secular"]});
//   console.log('Secular worldview atoms:', worldviewFiltered.length);
// }
//
// setTimeout(exampleAtomOps, 1000); // Delay to allow initialization
