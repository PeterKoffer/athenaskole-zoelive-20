
import { describe, it, expect } from 'vitest';
import { UniverseGenerator } from '../../services/UniverseGenerator';

describe('UniverseGenerator', () => {
    it('should return a universe by id', () => {
        const universe = UniverseGenerator.getUniverseById('u1');
        expect(universe).toBeDefined();
        expect(universe?.title).toBeDefined();
    });
});
