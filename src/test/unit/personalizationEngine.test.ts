import { PersonalizationEngine, UserPreferences } from '../../services/PersonalizationEngine';
import { UniverseGenerator } from '../../services/UniverseGenerator';

describe('PersonalizationEngine', () => {
    it('should return a personalized universe', () => {
        const universes = UniverseGenerator.getUniverses();
        const universe = universes[0];
        const preferences: UserPreferences = {
            learningStyle: 'visual',
            difficulty: 'easy'
        };
        const personalizedUniverse = PersonalizationEngine.personalizeUniverse(universe, preferences);
        expect(personalizedUniverse).toBeDefined();
        expect(personalizedUniverse.id).toBe(universe.id);
    });
});
