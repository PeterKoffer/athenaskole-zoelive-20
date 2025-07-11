import { MockCurriculumService } from './MockCurriculumService';
import { mockCurriculumData } from '../../data/mockCurriculumData';
import { CurriculumNodeType, CurriculumNodeFilters } from '../../types/curriculum'; // Adjusted path
import { NELIESubject } from '../../types/curriculum/NELIESubjects'; // Adjusted path

describe('MockCurriculumService', () => {
  let service: MockCurriculumService;

  beforeEach(() => {
    service = new MockCurriculumService();
  });

  describe('getNodeById', () => {
    it('should return a node if found', async () => {
      const node = await service.getNodeById('us-g6-math-rp-1-obj1-kc1'); // Existing KC ID
      expect(node).toBeDefined();
      expect(node!.id).toBe('us-g6-math-rp-1-obj1-kc1');
      expect(node!.name).toBe('Define ratio');
    });

    it('should return undefined if node not found', async () => {
      const node = await service.getNodeById('non-existent-id');
      expect(node).toBeUndefined();
    });
  });

  describe('getChildren', () => { // Testing the interface method
    it('should return direct children of a parent node', async () => {
      // us-g6-ela-rl-1 is a learning objective with two KCs as children
      const children = await service.getChildren('us-g6-ela-rl-1');
      expect(children).toHaveLength(2);
      expect(children.some(c => c.id === 'us-g6-ela-rl-1-kc1')).toBe(true);
      expect(children.some(c => c.id === 'us-g6-ela-rl-1-kc2')).toBe(true);
    });

    it('should return an empty array if parent has no children', async () => {
      const children = await service.getChildren('us-g6-ela-rl-1-kc1'); // A KC, should have no children in mock
      expect(children).toHaveLength(0);
    });

    it('should return an empty array if parentId does not exist', async () => {
      const children = await service.getChildren('non-existent-parent-id');
      expect(children).toHaveLength(0);
    });
  });

  describe('getDescendants', () => {
    it('should return all descendants of a parent node', async () => {
      // 'us-g6-math-rp' (Ratios and Proportional Relationships domain) has 1 topic, which has 1 LO, which has 2 KCs.
      // Total descendants = 1 (topic) + 1 (LO) + 2 (KCs) = 4
      const descendants = await service.getDescendants('us-g6-math-rp');
      expect(descendants).toHaveLength(4);
      expect(descendants.some(d => d.id === 'us-g6-math-rp-1')).toBe(true); // Topic
      expect(descendants.some(d => d.id === 'us-g6-math-rp-1-obj1')).toBe(true); // LO
      expect(descendants.some(d => d.id === 'us-g6-math-rp-1-obj1-kc1')).toBe(true); // KC1
      expect(descendants.some(d => d.id === 'us-g6-math-rp-1-obj1-kc2')).toBe(true); // KC2
    });

    it('should return direct children if they have no further descendants', async () => {
      const descendants = await service.getDescendants('us-g6-ela-rl-1'); // LO with 2 KCs
      expect(descendants).toHaveLength(2);
      expect(descendants.every(d => d.nodeType === 'kc')).toBe(true);
    });

    it('should return an empty array if parent has no children/descendants', async () => {
      const descendants = await service.getDescendants('us-g6-ela-rl-1-kc1'); // A KC node
      expect(descendants).toHaveLength(0);
    });

     it('should return an empty array if parentId does not exist', async () => {
      const descendants = await service.getDescendants('non-existent-parent-id-for-desc');
      expect(descendants).toHaveLength(0);
    });
  });

  describe('generateAIContextForNode', () => {
    it('should return a string containing context for an existing node', async () => {
      const context = await service.generateAIContextForNode('sp-us-g3-math-oa-1'); // StudyPug transformed LO
      expect(context).toBeDefined();
      expect(typeof context).toBe('string');
      expect(context).toContain('📚 CURRICULUM CONTEXT:');
      expect(context).toContain('- Node ID: sp-us-g3-math-oa-1');
      expect(context).toContain('- Name: Interpret products of whole numbers, e.g., interpret 5 × 7 as the total number of objects in 5 groups of 7 objects each.');
      expect(context).toContain('- Standard/Source ID: 3.OA.A.1');
      expect(context).toContain('- Prerequisites: None'); // Based on current mock data for this node
      expect(context).toContain('STUDYPUG DATA:');
      expect(context).toContain('- Difficulty Level: 4/10');
    });

    it('should return null if node not found', async () => {
      const context = await service.generateAIContextForNode('non-existent-id-for-ai-context');
      expect(context).toBeNull();
    });
  });

  describe('getNodes', () => {
    it('should return all nodes if no filters are provided', async () => {
      const nodes = await service.getNodes({});
      // Compare length with the original mock data, accounting for the deep clone
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

    it('should filter by an array of nodeTypes', async () => {
      const filters: CurriculumNodeFilters = { nodeType: ['country', 'subject'] };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(['country', 'subject']).toContain(node.nodeType);
      });
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

    it('should filter by subjectName (standardized)', async () => {
      // Using subjectName from CurriculumNode, which should be the standardized NELIESubject value
      const filters: CurriculumNodeFilters = { subjectName: 'Mathematics' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        // Check that subjectName matches, or if it's a higher level node, that it has descendants with that subject
        expect(node.subjectName === 'Mathematics' || node.subject === NELIESubject.MATH || mockCurriculumData.filter(d => d.parentId === node.id && d.subjectName === 'Mathematics').length > 0 ).toBeTruthy();
      });
      expect(nodes.some(n => n.id === 'us-g6-math')).toBe(true);
      expect(nodes.some(n => n.id === 'dk-g6-math')).toBe(true);
    });

    it('should filter by parentId', async () => {
      const filters: CurriculumNodeFilters = { parentId: 'us-g6-math-rp' }; // Domain of Ratios and Proportional Relationships
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBe(1); // Expecting one topic: 'us-g6-math-rp-1'
      expect(nodes[0].id).toBe('us-g6-math-rp-1');
    });

    it('should filter by nameContains (case-insensitive)', async () => {
      const filters: CurriculumNodeFilters = { nameContains: 'ratio' };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      nodes.forEach(node => {
        expect(node.name.toLowerCase()).toContain('ratio');
      });
      expect(nodes.some(n => n.id === 'us-g6-math-rp-1-obj1-kc1')).toBe(true); // "Define ratio"
    });

    it('should filter by tags (match any)', async () => {
      const filters: CurriculumNodeFilters = { tags: ['textual_evidence', 'dialogue'] };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      expect(nodes.some(n => n.id === 'us-g6-ela-rl-1')).toBe(true); // has 'textual_evidence'
      expect(nodes.some(n => n.id === 'dk-g6-engelsk-mundtlig-obj1')).toBe(true); // has 'dialogue'
    });

    it('should filter by subjectSpecific metadata (simple case)', async () => {
      const filters: CurriculumNodeFilters = {
        subjectSpecificFilters: { linguisticSkill: 'speaking' }
      };
      const nodes = await service.getNodes(filters);
      expect(nodes.length).toBeGreaterThan(0);
      expect(nodes.every(n => n.subjectSpecific?.linguisticSkill === 'speaking')).toBe(true);
      expect(nodes.some(n => n.id === 'dk-g6-engelsk-mundtlig-obj1')).toBe(true);
    });

    it('should return an empty array if no nodes match filters', async () => {
      const filters: CurriculumNodeFilters = { countryCode: 'NON_EXISTENT_COUNTRY_CODE' };
      const nodes = await service.getNodes(filters);
      expect(nodes).toHaveLength(0);
    });
  });
});
