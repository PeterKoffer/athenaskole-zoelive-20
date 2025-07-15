import { CurriculumNode, CurriculumNodeFilters, NELIESubject, ICurriculumService } from '@/types/curriculum/index';
import { mockCurriculumData } from '@/data/curriculum';
import { MockCurriculumService } from './MockCurriculumService';

export class CurriculumService implements ICurriculumService {
  private service: ICurriculumService;

  constructor() {
    if (process.env.NODE_ENV === 'test') {
      this.service = new MockCurriculumService();
    } else {
      // In a real application, you would initialize a different service
      // that fetches data from a database or API.
      this.service = new MockCurriculumService();
    }
  }

  async getNodeById(id: string): Promise<CurriculumNode | undefined> {
    return this.service.getNodeById(id);
  }

  async getChildren(parentId: string): Promise<CurriculumNode[]> {
    return this.service.getChildren(parentId);
  }

  async getChildrenOfNode(parentId: string): Promise<CurriculumNode[]> {
    return this.service.getChildrenOfNode(parentId);
    }

  async getDescendants(parentId: string): Promise<CurriculumNode[]> {
    return this.service.getDescendants(parentId);
  }

  async generateAIContextForNode(nodeId: string): Promise<string> {
    return this.service.generateAIContextForNode(nodeId);
  }

  async getNodes(filters: CurriculumNodeFilters = {}): Promise<CurriculumNode[]> {
    return this.service.getNodes(filters);
  }

    async getNodePath(nodeId: string): Promise<CurriculumNode[]> {
        const path: CurriculumNode[] = [];
        let currentNode = await this.getNodeById(nodeId);

        while (currentNode) {
        path.unshift(currentNode);
        if (currentNode.parentId) {
            currentNode = await this.getNodeById(currentNode.parentId);
        } else {
            currentNode = undefined;
        }
        }

        return path;
    }

    async getStats(): Promise<any> {
        const nodes = await this.getNodes();
        const nodesByType = nodes.reduce((acc, node) => {
            acc[node.nodeType] = (acc[node.nodeType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const nodesByCountry = nodes.reduce((acc, node) => {
            if (node.countryCode) {
                acc[node.countryCode] = (acc[node.countryCode] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        return {
            totalNodes: nodes.length,
            nodesByType,
            nodesByCountry,
        };
    }
}
