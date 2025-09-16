export type GenerateContentInput = {
  subject: string;
  grade: number;
  curriculum: string;
  ability?: string;
  learningStyle?: string;
  interests?: string[];
  scenarioId?: string;
  scenarioTitle?: string;
};

export interface LLMProvider {
  generateContent(input: GenerateContentInput): Promise<unknown>;
}