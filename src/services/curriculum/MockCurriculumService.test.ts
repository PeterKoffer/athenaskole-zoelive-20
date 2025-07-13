import { describe, it, expect, beforeEach } from 'vitest';
import { MockCurriculumService } from './MockCurriculumService';
import { mockCurriculumData } from '@/data/mockCurriculumData';
import { CurriculumNodeType, CurriculumNodeFilters } from '@/types/curriculum/index';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

describe('MockCurriculumService', () => {
  let service: MockCurriculumService;

  beforeEach(() => {
    service = new MockCurriculumService();
  });

  describe('getNodeById', () => {
    it('should return a node if found', async () => {
      // Using an existing ID from usMathData.ts
      const node = await service.getNodeById('us-k-math-cc-1');
      expect(node).toBeDefined();
      expect(node!.id).toBe('us-k-math-cc-1');
      expect(node!.name).toBe('Count to 100 by ones and by tens');
    });

    it('should return undefined if node not found', async () => {
      const node = await service.getNodeById('non-existent-id');
      expect(node).toBeUndefined();
    });
  });

  describe('getChildrenOfNode', () => {
    it('should return direct children of a parent node', async () => {
      // Using 'us-k-math-cc' (domain) which has 'us-k-math-cc-1', 'us-k-math-cc-2'
      const children = await service.getChildrenOfNode('us-k-math-cc');
      expect(children).toHaveLength(2);
      expect(children.some(c => c.id === 'us-k-math-cc-1')).toBe(true);
      expect(children.some(c => c.id === 'us-k-math-cc-2')).toBe(true);
    });

    it('should return an empty array if parent has no children', async () => {
      // 'us-k-math-cc-1' is a learning_objective, no children in mock data
      const children = await service.getChildrenOfNode('us-k-math-cc-1');
      expect(children).toHaveLength(0);
    });

    it('should return an empty array if parentId does not exist', async () => {
      const children = await service.getChildrenOfNode('non-existent-parent-id');
      expect(children).toHaveLength(0);
    });
  });

  describe('getNodes', () => {
    it('should return all nodes if no filters are provided', async () => {
      const nodes = await service.getNodes({});
      expect(nodes.length).toBe(mockCurriculumData.length);
    });

    it('should filter by nodeType', async () => {
      const filters: CurriculumNodeFilters = { nodeType: 'subject' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.nodeType).toBe('subject');
      });
      expect(nodes.some(n => n.id === 'us-math')).toBe(true);
    });

    it('should filter by countryCode', async () => {
      const filters: CurriculumNodeFilters = { countryCode: 'US' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.countryCode).toBe('US');
      });
      expect(nodes.some(n => n.id === 'us-math')).toBe(true);
    });

    it('should filter by subject', async () => {
        const filters: CurriculumNodeFilters = { subject: NELIESubject.MATH };
        const nodes = await service.getNodes(filters);
        expect(nodes.length).toBeGreaterThan(0);
        nodes.forEach(node => {
          expect(node.subject).toBe(NELIESubject.MATH);
        });
        expect(nodes.some(n => n.id === 'us-math')).toBe(true);
      });
  });
});
