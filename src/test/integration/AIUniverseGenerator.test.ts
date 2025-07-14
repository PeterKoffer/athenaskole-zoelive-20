import { AIUniverseGenerator } from '../../services/AIUniverseGenerator';

describe('AIUniverseGenerator', () => {
    it('should generate a universe from a prompt', async () => {
        const universe = await AIUniverseGenerator.generateUniverse('A story about a brave knight who must solve a riddle to save a kingdom.');
        expect(universe).toBeDefined();
        expect(universe.title).toBeDefined();
        expect(universe.description).toBeDefined();
    });
});
