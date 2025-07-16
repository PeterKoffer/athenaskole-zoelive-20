
import React, { useState, useEffect } from 'react';
import UniversePlayer from '../components/UniversePlayer';
import { Universe } from '../services/UniverseGenerator';
import { PersonalizationEngine } from '../services/PersonalizationEngine';
import { StudentProfile } from '../types/student';
import { CurriculumMapper, CurriculumStandard } from '../services/CurriculumMapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

const UniversePage: React.FC = () => {
    const [universe, setUniverse] = useState<Universe | null>(null);
    const [standards, setStandards] = useState<CurriculumStandard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const generateUniverse = async () => {
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
        } catch (err) {
            setError('Failed to generate universe. Please try again.');
            console.error('Universe generation error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateUniverse();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center">
                        <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
                        <h2 className="text-xl font-semibold mb-2">Creating Your Universe</h2>
                        <p className="text-muted-foreground">Personalizing your learning adventure...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center">
                        <div className="text-red-500 mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold mb-2 text-red-600">Something went wrong</h2>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Button onClick={generateUniverse} className="w-full">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Universe Adventure</h1>
                    <Button onClick={generateUniverse} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate New Universe
                    </Button>
                </div>
                <p className="text-muted-foreground mt-2">
                    Explore personalized learning adventures tailored to your interests
                </p>
            </div>

            {universe ? (
                <UniversePlayer universe={universe} standards={standards} />
            ) : (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">No universe available</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default UniversePage;
