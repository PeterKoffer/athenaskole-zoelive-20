
import React, { useState, useEffect } from 'react';
import { aiUniverseGenerator } from '../services/AIUniverseGenerator';
import { Universe } from '../services/UniverseGenerator';

const UniversePage: React.FC = () => {
    const [universe, setUniverse] = useState<Universe | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateUniverse = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await aiUniverseGenerator.generateUniverse(
                "A magical world where students learn through adventure and discovery"
            );
            if (result) {
                setUniverse(result);
            }
        } catch (err) {
            console.error('Universe generation error:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate universe');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateUniverse();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Generating your learning universe...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-red-600">
                    <p className="mb-4">Error: {error}</p>
                    <button 
                        onClick={generateUniverse}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!universe) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>No universe generated yet.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{universe.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-3">Description</h2>
                    <p className="text-muted-foreground">{universe.description}</p>
                </div>

                <div className="bg-card rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-3">Characters</h2>
                    <ul className="space-y-2">
                        {universe.characters?.map((character, index) => (
                            <li key={index} className="text-muted-foreground">• {character}</li>
                        )) || <li className="text-muted-foreground">No characters available</li>}
                    </ul>
                </div>

                <div className="bg-card rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-3">Locations</h2>
                    <ul className="space-y-2">
                        {universe.locations?.map((location, index) => (
                            <li key={index} className="text-muted-foreground">• {location}</li>
                        )) || <li className="text-muted-foreground">No locations available</li>}
                    </ul>
                </div>

                <div className="bg-card rounded-lg p-6 md:col-span-2 lg:col-span-3">
                    <h2 className="text-xl font-semibold mb-3">Activities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {universe.activities?.map((activity, index) => (
                            <div key={index} className="text-muted-foreground">• {activity}</div>
                        )) || <div className="text-muted-foreground">No activities available</div>}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <button 
                    onClick={generateUniverse}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Generate New Universe
                </button>
            </div>
        </div>
    );
};

export default UniversePage;
