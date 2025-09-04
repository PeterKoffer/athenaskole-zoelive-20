import { AI_CONFIG } from '@/config/aiConfig';

export type TextRequest = {
  orgId: string;
  purpose: 'universe' | 'training';
  urgency: 'low' | 'high';
  subjectId: string;
  prompt: { messages: Array<{ role: 'system'|'user'|'assistant'; content: string }> };
};

export type ImageRequest = {
  orgId: string;
  purpose: 'universe' | 'training';
  prompt: string;
  preferSquare?: boolean;
};

export type TextDecision = {
  allow: boolean;
  provider: 'openai';
  model: 'gpt-4o-mini' | 'gpt-4o-mini-high' | 'gpt-4o-mini-low';
  maxTokens: number;
  cheap: boolean;
  reason?: string;
};

export type ImageDecision = {
  allow: boolean;
  provider: 'bfl';
  size: '512' | '768' | '1024';
  steps: number; // conceptual “quality”
  reason?: string;
};

export class CostGovernor {
  static decideText(req: TextRequest): TextDecision {
    const cheap = AI_CONFIG.CHEAP_MODE || req.purpose === 'training';
    const baseTokens = Math.min(AI_CONFIG.MAX_TOKENS, cheap ? 700 : 1500);
    const model: TextDecision['model'] =
      cheap ? 'gpt-4o-mini-low' : (req.urgency === 'high' ? 'gpt-4o-mini-high' : 'gpt-4o-mini');

    // Here we would also ask backend for budget headroom; client just hints.
    return { allow: true, provider: 'openai', model, maxTokens: baseTokens, cheap };
  }

  static decideImage(req: ImageRequest): ImageDecision {
    // Degrade aggressively for cost
    const cheap = AI_CONFIG.CHEAP_MODE || req.purpose === 'training';
    const size: ImageDecision['size'] = cheap ? '512' : (req.preferSquare ? '768' : '1024');
    const steps = cheap ? 20 : 40;
    return { allow: true, provider: 'bfl', size, steps };
  }
}
