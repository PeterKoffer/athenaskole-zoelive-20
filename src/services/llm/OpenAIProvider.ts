import type { LLMProvider, GenerateContentInput } from "./Provider";

export class OpenAIProvider implements LLMProvider {
  async generateContent(_input: GenerateContentInput): Promise<unknown> {
    throw new Error("OpenAIProvider not implemented yet - use EdgeFunctionProvider");
  }
}