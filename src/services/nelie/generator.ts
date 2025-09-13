// src/services/nelie/generator.ts
// Vælg hvilken implementation der skal bruges.
const USE_MAIN_GENERATOR = false;

import * as Current from "../NELIESessionGenerator";
// Den portede fra main er lagt som .main.ts i samme mappe
// og kan have en lidt anden API – vi wrapper den let.
import * as MainAlt from "./NELIESessionGenerator.main";

export type SessionConfig = Parameters<typeof Current.generateSession>[0];

export async function generateSession(config: SessionConfig) {
  if (USE_MAIN_GENERATOR) {
    // Hvis MainAlt har en anden signatur, wrap her.
    // Antag samme shape for nu:
    // @ts-expect-error forskellige typer tolereres indtil vi har tilpasset.
    return MainAlt.generateSession(config);
  }
  return Current.generateSession(config);
}
