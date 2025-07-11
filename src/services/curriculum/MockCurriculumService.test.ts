
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
      const node = await service.getNodeById('us-g6-math-rp-1-obj1-kc1');
      expect(node).toBeDefined();
      expect(node!.id).toBe('us-g6-math-rp-1-obj1-kc1');
      expect(node!.name).toBe('Define ratio');
    });

    it('should return undefined if node not found', async () => {
      const node = await service.getNodeById('non-existent-id');
      expect(node).toBeUndefined();
    });
  });

  describe('getChildrenOfNode', () => {
    it('should return direct children of a parent node', async () => {
      const children = await service.getChildrenOfNode('us-g6-ela-rl-1');
      expect(children).toHaveLength(2);
      expect(children.some(c => c.id === 'us-g6-ela-rl-1-kc1')).toBe(true);
      expect(children.some(c => c.id === 'us-g6-ela-rl-1-kc2')).toBe(true);
    });

    it('should return an empty array if parent has no children', async () => {
      const children = await service.getChildrenOfNode('us-g6-ela-rl-1-kc1');
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
      expect(nodes.some(n => n.id === 'dk-g6-math')).toBe(true);
    });

    it('should filter by subjectName', async () => {
      const filters: CurriculumNodeFilters = { subjectName: 'Mathematics' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.subjectName).toBe('Mathematics');
      });
      expect(nodes.some(n => n.id === 'us-g6-math')).toBe(true);
      expect(nodes.some(n => n.id === 'dk-g6-math')).toBe(true);
    });
  });
});
