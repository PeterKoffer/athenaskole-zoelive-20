import { describe, it, expect, beforeEach } from 'vitest';
import { CurriculumService } from './CurriculumService';
import { mockCurriculumData } from '@/data/mockCurriculumData';
import { CurriculumNodeFilters } from '@/types/curriculum/CurriculumFilters';

describe('CurriculumService', () => {
  let service: CurriculumService;

  beforeEach(() => {
    service = new CurriculumService();
  });

  describe('getNodeById', () => {
    it('should return a node if found', async () => {
      const node = await service.getNodeById('us-g3-math-oa-1-obj1-kc1');
      expect(node).toBeDefined();
      expect(node!.id).toBe('us-g3-math-oa-1-obj1-kc1');
      expect(node!.name).toBe('Understand multiplication as groups');
    });

    it('should return undefined if node not found', async () => {
      const node = await service.getNodeById('non-existent-id');
      expect(node).toBeUndefined();
    });
  });

  describe('getChildren', () => {
    it('should return direct children of a parent node', async () => {
      const children = await service.getChildren('us-g3-math-oa-1-obj1');
      expect(children).toHaveLength(2);
      expect(children.some(c => c.id === 'us-g3-math-oa-1-obj1-kc1')).toBe(true);
      expect(children.some(c => c.id === 'us-g3-math-oa-1-obj1-kc2')).toBe(true);
    });

    it('should return empty array if parent has no children', async () => {
      const children = await service.getChildren('us-g3-math-oa-1-obj1-kc1');
      expect(children).toHaveLength(0);
    });
  });

  describe('getDescendants', () => {
    it('should return all descendants of a parent node', async () => {
      const descendants = await service.getDescendants('us-g3-math-oa');
      expect(descendants.length).toBeGreaterThan(2);
      
      // Should include topics, learning objectives, and KCs
      expect(descendants.some(d => d.nodeType === 'topic')).toBe(true);
      expect(descendants.some(d => d.nodeType === 'learning_objective')).toBe(true);
      expect(descendants.some(d => d.nodeType === 'kc')).toBe(true);
    });
  });

  describe('getNodes with filters', () => {
    it('should return all nodes if no filters provided', async () => {
      const nodes = await service.getNodes();
      expect(nodes.length).toBe(mockCurriculumData.length);
    });

    it('should filter by nodeType', async () => {
      const filters: CurriculumNodeFilters = { nodeType: 'country' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.nodeType).toBe('country');
      });
    });

    it('should filter by array of nodeTypes', async () => {
      const filters: CurriculumNodeFilters = { nodeType: ['country', 'subject'] };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(['country', 'subject']).toContain(node.nodeType);
      });
    });

    it('should filter by countryCode', async () => {
      const filters: CurriculumNodeFilters = { countryCode: 'US' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.countryCode).toBe('US');
      });
    });

    it('should filter by educationalLevel', async () => {
      const filters: CurriculumNodeFilters = { educationalLevel: '3' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.educationalLevel).toBe('3');
      });
    });

    it('should filter by subjectName', async () => {
      const filters: CurriculumNodeFilters = { subjectName: 'Mathematics' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.subjectName).toBe('Mathematics');
      });
    });

    it('should filter by parentId', async () => {
      const filters: CurriculumNodeFilters = { parentId: 'us-g3-math-oa' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.parentId).toBe('us-g3-math-oa');
      });
    });

    it('should filter by nameContains (case-insensitive)', async () => {
      const filters: CurriculumNodeFilters = { nameContains: 'multiplication' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.name.toLowerCase()).toContain('multiplication');
      });
    });

    it('should filter by tags', async () => {
      const filters: CurriculumNodeFilters = { tags: ['foundational'] };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.tags).toContain('foundational');
      });
    });

    it('should filter by multiple criteria', async () => {
      const filters: CurriculumNodeFilters = {
        countryCode: 'US',
        nodeType: 'learning_objective',
        educationalLevel: '3'
      };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.countryCode).toBe('US');
        expect(node.nodeType).toBe('learning_objective');
        expect(node.educationalLevel).toBe('3');
      });
    });

    it('should return empty array if no nodes match filters', async () => {
      const filters: CurriculumNodeFilters = { countryCode: 'NON_EXISTENT' };
      const nodes = await service.getNodes(filters);
      expect(nodes).toHaveLength(0);
    });
  });

  describe('generateAIContextForNode', () => {
    it('should generate context for a node', async () => {
      const context = await service.generateAIContextForNode('us-g3-math-oa-1-obj1');
      expect(context).toContain('LEARNING_OBJECTIVE');
      expect(context).toContain('Interpret products of whole numbers');
      expect(context).toContain('Grade Level: 3');
      expect(context).toContain('Subject: Mathematics');
    });

    it('should return error message for non-existent node', async () => {
      const context = await service.generateAIContextForNode('non-existent');
      expect(context).toContain('not found');
    });
  });

  describe('getNodePath', () => {
    it('should return path from root to node', async () => {
      const path = await service.getNodePath('us-g3-math-oa-1-obj1-kc1');
      expect(path.length).toBeGreaterThan(3);
      expect(path[0].nodeType).toBe('country');
      expect(path[path.length - 1].nodeType).toBe('kc');
      expect(path[path.length - 1].id).toBe('us-g3-math-oa-1-obj1-kc1');
    });
  });

  describe('getStats', () => {
    it('should return curriculum statistics', async () => {
      const stats = await service.getStats();
      expect(stats.totalNodes).toBe(mockCurriculumData.length);
      expect(stats.nodesByType).toBeDefined();
      expect(stats.nodesByCountry).toBeDefined();
      expect(stats.nodesBySubject).toBeDefined();
      expect(stats.nodesByType.country).toBeGreaterThan(0);
      expect(stats.nodesByCountry.US).toBeGreaterThan(0);
    });
  });
});
