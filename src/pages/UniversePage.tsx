
import React, { useState, useEffect } from 'react';
import UniversePlayer from '../components/UniversePlayer';
import { Universe } from '../services/UniverseGenerator';
import { PersonalizationEngine } from '../services/PersonalizationEngine';
import { StudentProfile } from '../types/student';
import { CurriculumMapper, CurriculumStandard } from '../services/CurriculumMapper';

const UniversePage: React.FC = () => {
    const [universe, setUniverse] = useState<Universe | null>(null);
    const [standards, setStandards] = useState<CurriculumStandard[]>([]);

    useEffect(() => {
        const generateUniverse = async () => {
            const student: StudentProfile = {
                id: '1',
                name: 'John Doe',
                gradeLevel: 6,
                interests: ['space', 'dinosaurs'],
                abilities: {
                    math: 'intermediate'
                }
            };
            const initialUniverse: Universe = {
                id: '1',
                title: 'Travel to China',
                description: 'You have to travel to China to help a man in his store.',
                characters: ['You', 'The Shopkeeper'],
                locations: ['A store in China'],
                activities: ['Help the shopkeeper count his money', 'Learn some Chinese phrases']
            };
            const newUniverse = await PersonalizationEngine.personalizeUniverse(initialUniverse, student);
            setUniverse(newUniverse);

            const relevantStandards = CurriculumMapper.getStandardsForUniverse(newUniverse);
            setStandards(relevantStandards);
        };

        generateUniverse();
    }, []);

    return (
        <div>
            <h1>Universe Page</h1>
            {universe ? (
                <>
                    <UniversePlayer universe={universe} />
                    <h2>Curriculum Standards</h2>
                    <ul>
                        {standards.map(standard => (
                            <li key={standard.id}>{standard.description}</li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UniversePage;
