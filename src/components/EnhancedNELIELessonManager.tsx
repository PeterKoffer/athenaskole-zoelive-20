import React, { useState, useEffect } from 'react';
import NELIESessionGenerator from '../services/NELIESessionGenerator';

interface EnhancedNELIELessonManagerProps {
    studentGrade: number;
    preferredLearningStyle: string;
    onLessonStart: (subject: string, lesson: any) => void;
    onSessionComplete: (session: any) => void;
}

const EnhancedNELIELessonManager: React.FC<EnhancedNELIELessonManagerProps> = ({
    studentGrade,
    preferredLearningStyle,
    onLessonStart,
    onSessionComplete
}) => {
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        const newSession = NELIESessionGenerator.generateSession({
            gradeLevel: studentGrade,
            preferredLearningStyle,
            subjects: ['mathematics', 'english', 'science', 'music', 'computerScience', 'creativeArts'],
            enableUniqueness: true
        });
        setSession(newSession);
        onSessionComplete(newSession);
    }, [studentGrade, preferredLearningStyle, onSessionComplete]);

    const handleStartLesson = (subject: string) => {
        if (session) {
            onLessonStart(subject, session[subject]);
        }
    };

    return (
        <div>
            <h2>Enhanced NELIE Lesson Manager</h2>
            {session && (
                <div>
                    <p>Session ID: {session.sessionId}</p>
                    <p>Total Duration: {session.metadata.totalDuration / 60} minutes</p>
                    <div>
                        <h3>Subjects</h3>
                        {Object.keys(session.metadata.qualityScores).map(subject => (
                            <div key={subject}>
                                <span>{subject}</span>
                                <button onClick={() => handleStartLesson(subject)}>Start Lesson</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedNELIELessonManager;
