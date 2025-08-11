
import React from 'react';
import { Universe } from '../services/UniverseGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurriculumStandard } from '../services/CurriculumMapper';
import TextWithSpeaker from '@/components/education/components/shared/TextWithSpeaker';

interface UniversePlayerProps {
    universe: Universe;
    standards?: CurriculumStandard[];
}

const UniversePlayer: React.FC<UniversePlayerProps> = ({ universe, standards = [] }) => {
    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                {universe.image && (
                    <img src={universe.image} alt="Universe" className="w-full h-48 object-cover" />
                )}
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        {universe.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        {universe.description}
                    </p>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            👥 Characters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-1">
                            {(universe.characters || []).map((character, index) => (
                                <li key={index} className="text-sm">
                                    <TextWithSpeaker text={character} context={`universe-character-${index}`} position="corner" className="group">
                                        <span>{character}</span>
                                    </TextWithSpeaker>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            📍 Locations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-1">
                            {(universe.locations || []).map((location, index) => (
                                <li key={index} className="text-sm">
                                    <TextWithSpeaker text={location} context={`universe-location-${index}`} position="corner" className="group">
                                        <span>{location}</span>
                                    </TextWithSpeaker>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            🎯 Activities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-1">
                            {(universe.activities || []).map((activity, index) => (
                                <li key={index} className="text-sm">
                                    <TextWithSpeaker text={activity} context={`universe-activity-${index}`} position="corner" className="group">
                                        <span>{activity}</span>
                                    </TextWithSpeaker>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Enhanced Curriculum Standards Section */}
            {standards.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            📚 Learning Standards
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {standards.map(standard => (
                                <div key={standard.id} className="border-l-4 border-blue-500 pl-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {standard.subject}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            Grade {standard.gradeLevel}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {standard.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Fallback curriculum section if no standards provided */}
            {standards.length === 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            📚 Learning Standards
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm">
                                Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.
                            </p>
                            <p className="text-sm">
                                Know precise definitions of angle, circle, perpendicular line, parallel line, and line segment, based on the undefined notions of point, line, distance along a line, and distance around a circular arc.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default UniversePlayer;
