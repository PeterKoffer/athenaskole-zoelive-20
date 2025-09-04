export const AI_CONFIG = {
  FUNCTIONS_URL: (import.meta as any).env?.VITE_FUNCTIONS_URL ?? '/functions',
  TEXT_PROVIDER: (import.meta as any).env?.VITE_AI_TEXT_PROVIDER ?? 'openai',
  IMAGE_PROVIDER: (import.meta as any).env?.VITE_AI_IMAGE_PROVIDER ?? 'bfl',
  BUDGET_USD_MONTHLY: Number((import.meta as any).env?.VITE_AI_BUDGET_USD_MONTHLY ?? '25'),
  MAX_TOKENS: Number((import.meta as any).env?.VITE_AI_MAX_TOKENS ?? '1500'),
  CHEAP_MODE: ((import.meta as any).env?.VITE_AI_CHEAP_MODE ?? '0') === '1',
  ORG_ID_HEADER: 'x-org-id',
};
