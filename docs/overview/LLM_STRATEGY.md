# LLM Strategy (Provider-Agnostic)

Mål: Nem udskiftning af AI-udbyder efter go-live.

- Interface i services-lag (fx `Provider.generateContent(payload)`).
- Implementeringer: Supabase Edge → OpenAI (nu), alternativer (senere).
- Konfig via env/feature flags.
