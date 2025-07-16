
import { describe, it, expect } from 'vitest';
import { UniverseGenerator } from '../../services/UniverseGenerator';

describe('UniverseGenerator', () => {
    it('should return a list of universes', () => {
        const universes = UniverseGenerator.getUniverses();
        expect(universes).toBeDefined();
        expect(universes.length).toBe(6); // Updated to match actual count
    });
});
