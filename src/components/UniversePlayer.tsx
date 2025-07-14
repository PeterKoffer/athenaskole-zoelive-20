
import React from 'react';
import { Universe } from '../services/UniverseGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UniversePlayerProps {
    universe: Universe;
}

const UniversePlayer: React.FC<UniversePlayerProps> = ({ universe }) => {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{universe.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{universe.description}</p>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Characters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-1">
                            {universe.characters.map((character, index) => (
                                <li key={index}>{character}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Locations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-1">
                            {universe.locations.map((location, index) => (
                                <li key={index}>{location}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-1">
                            {universe.activities.map((activity, index) => (
                                <li key={index}>{activity}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Curriculum Standards Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Curriculum Standards</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p className="text-sm">Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.</p>
                        <p className="text-sm">Know precise definitions of angle, circle, perpendicular line, parallel line, and line segment, based on the undefined notions of point, line, distance along a line, and distance around a circular arc.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UniversePlayer;
