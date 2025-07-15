import { CurriculumService } from './CurriculumService';
import { NELIESubject, CurriculumNodeFilters } from '@/types/curriculum';

describe('CurriculumService', () => {
    let service: CurriculumService;

    beforeEach(() => {
        service = new CurriculumService();
    });

    describe('getNodeById', () => {
        it('should return a node if found', async () => {
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

    describe('getChildren', () => {
        it('should return direct children of a parent node', async () => {
            const children = await service.getChildren('us-k-math-cc');
            expect(children.length).toBeGreaterThan(0);
            expect(children.some(c => c.id === 'us-k-math-cc-1')).toBe(true);
            expect(children.some(c => c.id === 'us-k-math-cc-2')).toBe(true);
        });

        it('should return empty array if parent has no children', async () => {
            const children = await service.getChildren('us-k-math-cc-1');
            expect(children.length).toBe(0);
        });
    });

    describe('getDescendants', () => {
        it('should return all descendants of a parent node', async () => {
            const descendants = await service.getDescendants('us-k-math');
            expect(descendants.length).toBeGreaterThan(2);
            expect(descendants.some(d => d.nodeType === 'domain')).toBe(true);
        });
    });

    describe('getNodes with filters', () => {
        it('should return all nodes if no filters provided', async () => {
            const nodes = await service.getNodes();
            expect(nodes.length).toBe(10);
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
            const filters: CurriculumNodeFilters = { educationalLevel: 'K' };
            const nodes = await service.getNodes(filters);
            expect(nodes.length).toBeGreaterThan(0);
            nodes.forEach(node => {
                expect(node.educationalLevel).toBe('K');
            });
        });

        it('should filter by subject', async () => {
            const filters: CurriculumNodeFilters = { subject: NELIESubject.MATH };
            const nodes = await service.getNodes(filters);
            expect(nodes.length).toBeGreaterThan(0);
            nodes.forEach(node => {
                expect(node.subject).toBe(NELIESubject.MATH);
            });
        });

        it('should filter by parentId', async () => {
            const filters: CurriculumNodeFilters = { parentId: 'us-k-math-cc' };
            const nodes = await service.getNodes(filters);
            expect(nodes.length).toBeGreaterThan(0);
            nodes.forEach(node => {
                expect(node.parentId).toBe('us-k-math-cc');
            });
        });

        it('should filter by nameContains (case-insensitive)', async () => {
            const filters: CurriculumNodeFilters = { nameContains: 'count' };
            const nodes = await service.getNodes(filters);
            expect(nodes.length).toBeGreaterThan(0);
            nodes.forEach(node => {
                expect(node.name.toLowerCase()).toContain('count');
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
                educationalLevel: 'K',
                subject: NELIESubject.MATH,
            };
            const nodes = await service.getNodes(filters);
            expect(nodes.length).toBeGreaterThan(0);
            nodes.forEach(node => {
                expect(node.countryCode).toBe('US');
                expect(node.educationalLevel).toBe('K');
                expect(node.subject).toBe(NELIESubject.MATH);
            });
        });

        it('should return empty array if no nodes match filters', async () => {
            const filters: CurriculumNodeFilters = { nameContains: 'non-existent' };
            const nodes = await service.getNodes(filters);
            expect(nodes.length).toBe(0);
        });
    });

    describe('generateAIContextForNode', () => {
        it('should generate context for a node', async () => {
            const context = await service.generateAIContextForNode('us-g1-math-oa-1');
            expect(context).toContain('LEARNING_OBJECTIVE');
            expect(context).toContain('Use addition and subtraction within 20 to solve word problems');
            expect(context).toContain('Grade Level: 1');
        });

        it('should return error message for non-existent node', async () => {
            const context = await service.generateAIContextForNode('non-existent');
            expect(context).toBe('Node with ID non-existent not found.');
        });
    });

    describe('getNodePath', () => {
        it('should return path from root to node', async () => {
            const path = await service.getNodePath('us-k-math-cc-1');
            expect(path.length).toBeGreaterThan(2);
            expect(path[0].nodeType).toBe('subject');
            expect(path[path.length - 1].nodeType).toBe('learning_objective');
        });
    });

    describe('getStats', () => {
        it('should return curriculum statistics', async () => {
            const stats = await service.getStats();
            expect(stats.totalNodes).toBe(10);
            expect(stats.nodesByType).toBeDefined();
            expect(stats.nodesByCountry).toBeDefined();
        });
    });
});
