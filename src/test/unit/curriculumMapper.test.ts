import { CurriculumMapper } from '../../services/CurriculumMapper';
import { UniverseGenerator } from '../../services/UniverseGenerator';

describe('CurriculumMapper', () => {
    it('should return a list of curriculum standards for a given universe', () => {
        const universes = UniverseGenerator.getUniverses();
        const universe = universes[0];
        const standards = CurriculumMapper.getStandardsForUniverse(universe);
        expect(standards).toBeDefined();
        expect(standards.length).toBe(2);
    });
});
