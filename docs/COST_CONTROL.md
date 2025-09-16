# Cost & Scale Control

## Layers
1) **Policy (Governor)**: budgets, caps, cheap/normal modes, fallbacks, subject-aware knobs.
2) **Adapters**: vendor-neutral calls (text, images).
3) **Cache & Logs**: `ai_cache` (key,value,ttl), `ai_metrics` (org, model, tokens, est. cost).
4) **Rate-limit**: per org per minute; degrade before deny.
5) **Free Content**: Lesson Ideas bank as zero-cost fallback.

## Runtime knobs (env)
- `VITE_AI_TEXT_PROVIDER` (`openai`), `VITE_AI_IMAGE_PROVIDER` (`bfl`)
- `VITE_AI_BUDGET_USD_MONTHLY` (default 25)
- `VITE_AI_MAX_TOKENS` (default 1500)
- `VITE_AI_CHEAP_MODE` (1/0)
- `VITE_FUNCTIONS_URL`

## Fallback order
Bank ➜ small model ➜ lower quality (image size / tokens) ➜ deny (with user-friendly message).
