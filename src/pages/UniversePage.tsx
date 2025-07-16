
import React, { useState, useEffect, useRef } from 'react';
import UniversePlayer from '../components/UniversePlayer';
import { Universe } from '../services/UniverseGenerator';
import { aiUniverseGenerator } from '../services/AIUniverseGenerator';
import { StudentProfile } from '../types/student';
import { CurriculumMapper, CurriculumStandard } from '../services/CurriculumMapper';
import { Button } from '@/components/ui/button';

const UniversePage: React.FC = () => {
    const [universe, setUniverse] = useState<Universe | null>(null);
    const [standards, setStandards] = useState<CurriculumStandard[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const generateUniverse = async () => {
            abortControllerRef.current = new AbortController();
            setLoading(true);
            setError(null);
            try {
                const student: StudentProfile = {
                    id: '1',
                    name: 'John Doe',
                    gradeLevel: 6,
                    interests: ['space', 'dinosaurs'],
                    abilities: {
                        math: 'intermediate'
                    }
                };
                const prompt = `Generate a universe for a grade ${student.gradeLevel} student who is interested in ${student.interests.join(', ')}.`;
                const newUniverse = await aiUniverseGenerator.generateUniverse(prompt, abortControllerRef.current.signal);
                if (newUniverse) {
                    setUniverse(newUniverse);
                    const relevantStandards = CurriculumMapper.getStandardsForUniverse(newUniverse);
                    setStandards(relevantStandards);
                } else {
                    setError('Failed to generate universe.');
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError('An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        generateUniverse();

        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const handleCancel = () => {
        abortControllerRef.current?.abort();
    };

    return (
        <div>
            <h1>Universe Page</h1>
            {loading ? (
                <div>
                    <p>Loading...</p>
                    <Button onClick={handleCancel}>Cancel</Button>
                </div>
            ) : error ? (
                <p>Error: {error}</p>
            ) : universe ? (
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
                <p>No universe generated.</p>
            )}
        </div>
    );
};

export default UniversePage;
