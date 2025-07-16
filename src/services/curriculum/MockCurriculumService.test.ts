import { MockCurriculumService } from './MockCurriculumService';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

describe('MockCurriculumService', () => {
    let service: MockCurriculumService;

    beforeEach(() => {
        service = new MockCurriculumService();
    });

    describe('getLevels', () => {
        it('should return an array of curriculum levels', async () => {
            const levels = await service.getLevels();
            expect(levels).toBeInstanceOf(Array);
            expect(levels.length).toBeGreaterThan(0);
            expect(levels[0]).toHaveProperty('id');
            expect(levels[0]).toHaveProperty('name');
        });
    });

    describe('getSubjects', () => {
        it('should return an array of curriculum subjects for a given level', async () => {
            const subjects = await service.getSubjects('1');
            expect(subjects).toBeInstanceOf(Array);
            expect(subjects.length).toBeGreaterThan(0);
            expect(subjects[0]).toHaveProperty('id');
            expect(subjects[0]).toHaveProperty('name');
            expect(subjects[0]).toHaveProperty('levelId', '1');
        });
    });

    describe('getTopics', () => {
        it('should return an array of curriculum topics for a given subject', async () => {
            const topics = await service.getTopics('1');
            expect(topics).toBeInstanceOf(Array);
            expect(topics.length).toBeGreaterThan(0);
            expect(topics[0]).toHaveProperty('id');
            expect(topics[0]).toHaveProperty('name');
            expect(topics[0]).toHaveProperty('subjectId', '1');
        });
    });

    describe('getAllNodes', () => {
        it('should return a flattened array of all curriculum nodes', async () => {
            const nodes = await service.getAllNodes();
            expect(nodes).toBeInstanceOf(Array);
            expect(nodes.length).toBeGreaterThan(0);
            expect(nodes.some(n => n.nodeType === 'level')).toBe(true);
            expect(nodes.some(n => n.nodeType === 'subject')).toBe(true);
            expect(nodes.some(n => n.nodeType === 'topic')).toBe(true);
        });
    });

    describe('getStats', () => {
        it('should return curriculum statistics', async () => {
            const stats = await service.getStats();
            expect(stats).toBeDefined();
            expect(stats).toHaveProperty('totalNodes');
            expect(stats).toHaveProperty('nodesByType');
            expect(stats).toHaveProperty('nodesByCountry');
        });
    });
});
