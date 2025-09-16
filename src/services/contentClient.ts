import type { LLMProvider } from "./llm/Provider";
import { EdgeFunctionProvider } from "./llm/EdgeFunctionProvider";
// import { OpenAIProvider } from "./llm/OpenAIProvider";

// For now, we use EdgeFunction as default
// Later this can be configurable
const provider: LLMProvider = new EdgeFunctionProvider();

export const contentClient = provider;