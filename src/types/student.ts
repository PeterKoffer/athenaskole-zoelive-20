
export interface StudentProfile {
    id: string;
    name: string;
    gradeLevel: number;
    interests: string[];
    abilities: {
        [subject: string]: string;
    };
}
