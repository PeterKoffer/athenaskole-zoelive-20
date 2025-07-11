
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
      // Using an existing ID from usMathData.ts k-cc (domain)
      const node = await service.getNodeById('k-cc-1');
      expect(node).toBeDefined();
      expect(node!.id).toBe('k-cc-1');

      expect(node!.name).toBe('Count to 100 by ones and by tens (K.CC.A.1)');
    });

    it('should return undefined if node not found', async () => {
      const node = await service.getNodeById('non-existent-id');
      expect(node).toBeUndefined();
    });
  });

  describe('getChildrenOfNode', () => {
    it('should return direct children of a parent node', async () => {
      // Using 'k-cc' (domain) which has 'k-cc-1', 'k-cc-2', 'k-cc-3', 'k-cc-4', 'k-cc-5'
      const children = await service.getChildrenOfNode('k-cc');
      expect(children).toHaveLength(5); // k-cc now has 5 LOs
      expect(children.some(c => c.id === 'k-cc-1')).toBe(true);
      expect(children.some(c => c.id === 'k-cc-2')).toBe(true);
      expect(children.some(c => c.id === 'k-cc-3')).toBe(true);
      expect(children.some(c => c.id === 'k-cc-4')).toBe(true);
      expect(children.some(c => c.id === 'k-cc-5')).toBe(true);
    });

    it('should return an empty array if parent has no children', async () => {
      // 'k-cc-1' is a learning_objective, no children in mock data
      const children = await service.getChildrenOfNode('k-cc-1');
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
      const filters: CurriculumNodeFilters = { nodeType: 'country' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.nodeType).toBe('country');
      });
      expect(nodes.some(n => n.id === 'us')).toBe(true);
      expect(nodes.some(n => n.id === 'dk')).toBe(true);
    });

    it('should filter by countryCode', async () => {
      const filters: CurriculumNodeFilters = { countryCode: 'DK' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.countryCode).toBe('DK');
      });
      // Expecting 'dk-math' or 'dk-danish' (subject nodes under 'dk')
      expect(nodes.some(n => n.id === 'dk-math' || n.id === 'dk-danish' || n.id === 'dk')).toBe(true);
    });

    it('should filter by subjectName', async () => {
      const filters: CurriculumNodeFilters = { subjectName: 'Mathematics' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.subjectName).toBe('Mathematics');
      });
      // Expecting 'us-math' (subject) or 'dk-math' (subject)
      expect(nodes.some(n => n.id === 'us-math')).toBe(true);
      expect(nodes.some(n => n.id === 'dk-math')).toBe(true);
    });
  });
});
