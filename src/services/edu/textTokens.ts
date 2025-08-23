// src/services/edu/textTokens.ts
import { EduContext } from "./locale";

export function applyEduTokens(text: string, ctx: EduContext) {
  return text
    .replace(/\$\{units\.currencySymbol\}/g, ctx.currencySymbol)
    .replace(/\$\{locale\.language\}/g, ctx.language)
    .replace(/\$\{locale\.country\}/g, ctx.countryCode)
    .replace(/\$\{units\.measurement\}/g, ctx.measurement);
}