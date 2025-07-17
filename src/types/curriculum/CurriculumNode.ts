
export interface CurriculumNode {
    id: string;
    name: string;
    description?: string;
    subjectName: string;
    educationalLevel?: string;
    nodeType?: 'level' | 'subject' | 'topic' | 'subtopic';
    countryCode?: string;
    parentId?: string;
    children?: CurriculumNode[];
    metadata?: Record<string, any>;
}
