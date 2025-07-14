import React from 'react';
import UniversePlayer from '../components/UniversePlayer';
import { UniverseGenerator } from '../services/UniverseGenerator';
import { CurriculumMapper } from '../services/CurriculumMapper';
import { PersonalizationEngine, UserPreferences } from '../services/PersonalizationEngine';

const UniversePage: React.FC = () => {
    const universes = UniverseGenerator.getUniverses();
    const universe = universes[0]; // For now, just display the first universe

    const standards = CurriculumMapper.getStandardsForUniverse(universe);

    const preferences: UserPreferences = {
        learningStyle: 'visual',
        difficulty: 'easy'
    };

    const personalizedUniverse = PersonalizationEngine.personalizeUniverse(universe, preferences);

    return (
        <div>
            <h1>Universe Page</h1>
            <UniversePlayer universe={personalizedUniverse} />
            <h2>Curriculum Standards</h2>
            <ul>
                {standards.map(standard => (
                    <li key={standard.id}>{standard.description}</li>
                ))}
            </ul>
        </div>
    );
};

export default UniversePage;
