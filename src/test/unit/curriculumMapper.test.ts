
import { describe, it, expect } from 'vitest';
import { CurriculumMapper } from '../../services/CurriculumMapper';
import { UniverseGenerator } from '../../services/UniverseGenerator';

describe('CurriculumMapper', () => {
    it('should return a list of relevant curriculum standards for a given universe', () => {
        const universe = UniverseGenerator.getUniverseById('u1');
        const standards = CurriculumMapper.getStandardsForUniverse(universe);
        expect(standards).toBeDefined();
        expect(standards.length).toBeGreaterThan(0);
    });
});
