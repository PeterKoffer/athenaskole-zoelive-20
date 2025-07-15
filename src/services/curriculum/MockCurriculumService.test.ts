import { MockCurriculumService } from './MockCurriculumService';
import { NELIESubject, CurriculumNodeFilters } from '@/types/curriculum';

describe('MockCurriculumService', () => {
    let service: MockCurriculumService;

    beforeEach(() => {
        service = new MockCurriculumService();
    });

    describe('getNodeById', () => {
        it('should return a node if found', async () => {
            const node = await service.getNodeById('us-k-math-cc-1');
            expect(node).toBeDefined();
            expect(node!.id).toBe('us-k-math-cc-1');
        });

        it('should return undefined if node not found', async () => {
            const node = await service.getNodeById('non-existent-id');
            expect(node).toBeUndefined();
        });
    });

    describe('getChildrenOfNode', () => {
        it('should return direct children of a parent node', async () => {
            const children = await service.getChildrenOfNode('us-k-math-cc');
            expect(children.length).toBeGreaterThan(0);
        });

        it('should return an empty array if parent has no children', async () => {
            const children = await service.getChildrenOfNode('us-k-math-cc-1');
            expect(children.length).toBe(0);
        });

        it('should return an empty array if parentId does not exist', async () => {
            const children = await service.getChildrenOfNode('non-existent-id');
            expect(children.length).toBe(0);
        });
    });

    describe('getNodes', () => {
        it('should return all nodes if no filters are provided', async () => {
            const nodes = await service.getNodes({});
            expect(nodes.length).toBe(10);
        });

        it('should filter by nodeType', async () => {
            const nodes = await service.getNodes({ nodeType: 'domain' });
            expect(nodes.length).toBeGreaterThan(0);
            expect(nodes.every(n => n.nodeType === 'domain')).toBe(true);
        });

        it('should filter by countryCode', async () => {
            const nodes = await service.getNodes({ countryCode: 'US' });
            expect(nodes.length).toBeGreaterThan(0);
            expect(nodes.every(n => n.countryCode === 'US')).toBe(true);
        });

        it('should filter by subject', async () => {
            const nodes = await service.getNodes({ subject: NELIESubject.MATH });
            expect(nodes.length).toBeGreaterThan(0);
            expect(nodes.every(n => n.subject === NELIESubject.MATH)).toBe(true);
        });
    });
});
