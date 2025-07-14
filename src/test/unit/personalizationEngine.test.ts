import { PersonalizationEngine } from '../../services/PersonalizationEngine';
import { UniverseGenerator } from '../../services/UniverseGenerator';
import { StudentProfile } from '../../types/student';

describe('PersonalizationEngine', () => {
    it('should return a personalized universe', async () => {
        const universes = UniverseGenerator.getUniverses();
        const universe = universes[0];
        const student: StudentProfile = {
            id: '1',
            name: 'John Doe',
            gradeLevel: 6,
            interests: ['space', 'dinosaurs'],
            abilities: {
                math: 'intermediate'
            }
        };
        const personalizedUniverse = await PersonalizationEngine.personalizeUniverse(universe, student);
        expect(personalizedUniverse).toBeDefined();
        expect(personalizedUniverse.id).toBeDefined();
        expect(personalizedUniverse.title).toBeDefined();
        expect(personalizedUniverse.description).toBeDefined();
    });
});
