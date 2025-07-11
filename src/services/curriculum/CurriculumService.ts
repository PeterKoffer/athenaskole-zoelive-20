
import { CurriculumNode, CurriculumNodeFilters } from '@/types/curriculum/index';
import { mockCurriculumData } from '@/data/mockCurriculumData';
import { CurriculumServiceBase } from './core/CurriculumServiceBase';
import { CurriculumFilter } from './core/CurriculumFilter';
import { CurriculumStats } from './core/CurriculumStats';
import { CurriculumAIContext } from './core/CurriculumAIContext';

export interface ICurriculumService {
  getNodeById(id: string): Promise<CurriculumNode | undefined>;
  getNodes(filters?: CurriculumNodeFilters): Promise<CurriculumNode[]>;
  getChildren(parentId: string): Promise<CurriculumNode[]>;
  getDescendants(parentId: string): Promise<CurriculumNode[]>;
  generateAIContextForNode(nodeId: string): Promise<string>;
}

export class CurriculumService extends CurriculumServiceBase implements ICurriculumService {
  constructor() {
    super(mockCurriculumData);
  }

  async getNodes(filters?: CurriculumNodeFilters): Promise<CurriculumNode[]> {
    return CurriculumFilter.applyFilters(this.data, filters);
  }

  async generateAIContextForNode(nodeId: string): Promise<string> {
    const node = await this.getNodeById(nodeId);
    if (!node) {
      return `Node with ID ${nodeId} not found.`;
    }

    return CurriculumAIContext.generateContextForNode(
      node,
      this.getNodeById.bind(this),
      this.getChildren.bind(this)
    );
  }

  /**
   * Get curriculum statistics
   */
  async getStats() {
    return CurriculumStats.generateStats(this.data);
  }
}

// Export singleton instance
export const curriculumService = new CurriculumService();
export default curriculumService;
