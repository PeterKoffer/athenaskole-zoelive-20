// Budget Guard - Cost & Token Control for Multi-Prompt AI Generation
// deno-lint-ignore-file no-explicit-any

export type StepName = 
  | "hook" | "phaseplan" | "narrative" | "quiz" | "writing" 
  | "scenario" | "minigame" | "images" | "exit" | "validator" | "enrichment";

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_usd?: number;
  model?: string;
}

export interface ModelSpec {
  name: string;
  in_per_mtok: number;  // USD per million input tokens
  out_per_mtok: number; // USD per million output tokens
  max_output_tokens: number;
}

export interface StepConfig {
  priority: 1 | 2 | 3; // 1=critical, 2=important, 3=optional
  default_max_output_tokens: number;
}

export interface StepLog {
  step: StepName;
  model: string;
  allowed: boolean;
  reason?: string;
  max_tokens: number;
  started_at: string;
  finished_at?: string;
  usage?: Usage;
}

export interface BudgetConfig {
  plannedSteps: StepName[];
  tokenBudgetTotal: number;
  costCapUSD?: number;
  jsonMinified?: boolean;
  reserveForCritical?: number;
  modelMap: Record<StepName, ModelSpec>;
  stepConfig: Record<StepName, StepConfig>;
}

export class BudgetGuard {
  private totalTokens: number;
  private costCap?: number;
  private jsonMinified: boolean;
  private reserveTokens: number;
  private planned: StepName[];
  private modelMap: Record<StepName, ModelSpec>;
  private stepConfig: Record<StepName, StepConfig>;
  
  private usedPrompt = 0;
  private usedCompletion = 0;
  private usedUSD = 0;
  public logs: StepLog[] = [];

  constructor(config: BudgetConfig) {
    this.totalTokens = config.tokenBudgetTotal;
    this.costCap = config.costCapUSD;
    this.jsonMinified = config.jsonMinified ?? true;
    this.reserveTokens = config.reserveForCritical ?? 1000;
    this.planned = config.plannedSteps;
    this.modelMap = config.modelMap;
    this.stepConfig = config.stepConfig;
  }

  beginStep(step: StepName): { allowed: boolean; reason?: string; model: ModelSpec; max_tokens: number; logIndex: number } {
    const config = this.stepConfig[step];
    const model = this.modelMap[step];
    
    if (!config || !model) {
      throw new Error(`Unknown step: ${step}`);
    }

    const log: StepLog = {
      step,
      model: model.name,
      allowed: false,
      max_tokens: config.default_max_output_tokens,
      started_at: new Date().toISOString(),
    };

    // Check cost cap
    if (this.costCap && this.usedUSD >= this.costCap) {
      log.reason = "cost_cap_reached";
      this.logs.push(log);
      return { allowed: false, reason: log.reason, model, max_tokens: 0, logIndex: this.logs.length - 1 };
    }

    // Check token budget
    const remaining = this.remainingTokens();
    const criticalStepsLeft = this.remainingCriticalSteps(step);
    const reserveNeeded = criticalStepsLeft * 200; // rough estimate per critical step

    if (remaining < reserveNeeded && config.priority > 1) {
      log.reason = "budget_low_drop_optional";
      this.logs.push(log);
      return { allowed: false, reason: log.reason, model, max_tokens: 0, logIndex: this.logs.length - 1 };
    }

    // Clamp max_tokens based on remaining budget
    let maxTokens = config.default_max_output_tokens;
    const availableForThisStep = remaining - reserveNeeded;
    
    if (availableForThisStep < maxTokens) {
      maxTokens = Math.max(50, Math.floor(availableForThisStep * 0.8)); // keep some buffer
      log.reason = "tokens_clamped";
    }

    // Cost cap clamp
    if (this.costCap) {
      const remainingUSD = this.costCap - this.usedUSD;
      const maxTokensFromUSD = Math.floor((remainingUSD * 1_000_000) / model.out_per_mtok);
      if (maxTokensFromUSD < maxTokens) {
        maxTokens = Math.max(50, maxTokensFromUSD);
        log.reason = "cost_cap_clamp";
      }
    }

    log.allowed = true;
    log.max_tokens = maxTokens;
    this.logs.push(log);

    return { 
      allowed: true, 
      model, 
      max_tokens: maxTokens, 
      logIndex: this.logs.length - 1 
    };
  }

  finishStep(logIndex: number, usageOrText?: Usage | string, modelOverride?: string) {
    const log = this.logs[logIndex];
    if (!log) return;

    let usage: Usage | undefined;

    if (typeof usageOrText === "string") {
      const est = this.estimateTokens(usageOrText);
      usage = { 
        prompt_tokens: Math.round(est * 0.4), 
        completion_tokens: Math.round(est * 0.6), 
        total_tokens: est 
      };
    } else if (usageOrText) {
      const total = (usageOrText.prompt_tokens ?? 0) + (usageOrText.completion_tokens ?? 0);
      usage = {
        prompt_tokens: usageOrText.prompt_tokens ?? 0,
        completion_tokens: usageOrText.completion_tokens ?? 0,
        total_tokens: usageOrText.total_tokens ?? total,
      };
    }

    if (usage) {
      this.usedPrompt += usage.prompt_tokens;
      this.usedCompletion += usage.completion_tokens;

      const modelName = (modelOverride ?? log.model);
      const price = this.priceFor(modelName);
      const cost = (usage.prompt_tokens * price.in_per_mtok + usage.completion_tokens * price.out_per_mtok) / 1_000_000;
      this.usedUSD += cost;
      usage.cost_usd = cost;
      usage.model = modelName;

      log.usage = usage;
    }

    log.finished_at = new Date().toISOString();
  }

  remainingTokens() { 
    return Math.max(0, this.totalTokens - (this.usedPrompt + this.usedCompletion)); 
  }
  
  totalUsedTokens() { 
    return this.usedPrompt + this.usedCompletion; 
  }
  
  totalUsedUSD() { 
    return this.usedUSD; 
  }

  /** Return a report that can be sent back in API response meta */
  report() {
    return {
      token_budget_total: this.totalTokens,
      tokens_used: this.totalUsedTokens(),
      tokens_remaining: this.remainingTokens(),
      usd_spent_est: Number(this.usedUSD.toFixed(6)),
      steps: this.logs,
    };
  }

  /** JSON minification (if model accidentally sends whitespace) */
  minifyJSON<T = unknown>(data: T): string {
    if (!this.jsonMinified) return JSON.stringify(data, null, 2);
    try { 
      return JSON.stringify(data); 
    } catch { 
      return JSON.stringify(data, null, 0); 
    }
  }

  // --- helpers ---
  private remainingCriticalSteps(current: StepName): number {
    const currentIdx = this.planned.findIndex(s => s === current);
    const rest = currentIdx === -1 ? this.planned : this.planned.slice(currentIdx + 1);
    return rest.filter(s => this.stepConfig[s]?.priority === 1).length;
  }

  private priceFor(modelName: string) {
    const spec = Object.values(this.modelMap).find(m => m.name === modelName);
    if (spec) return { in_per_mtok: spec.in_per_mtok, out_per_mtok: spec.out_per_mtok };
    return { in_per_mtok: 0, out_per_mtok: 0 }; // fallback if unknown
  }

  private estimateTokens(text: string): number {
    // rough heuristic: 4 chars/token
    const len = (text ?? "").length;
    return Math.max(32, Math.ceil(len / 4));
  }
}

export function extractUsageFromLLMResponse(data: any): Usage | undefined {
  // OpenAI-like
  const u = data?.usage;
  if (u && (typeof u.prompt_tokens === "number" || typeof u.completion_tokens === "number")) {
    const total = (u.prompt_tokens ?? 0) + (u.completion_tokens ?? 0);
    return { 
      prompt_tokens: u.prompt_tokens ?? 0, 
      completion_tokens: u.completion_tokens ?? 0, 
      total_tokens: u.total_tokens ?? total 
    };
  }
  
  // Anthropic-like
  const a = data?.usage?.input_tokens ?? data?.usage?.output_tokens ? data.usage : undefined;
  if (a) {
    const prompt = a.input_tokens ?? 0; 
    const comp = a.output_tokens ?? 0; 
    const total = prompt + comp;
    return { prompt_tokens: prompt, completion_tokens: comp, total_tokens: total };
  }
  
  return undefined;
}