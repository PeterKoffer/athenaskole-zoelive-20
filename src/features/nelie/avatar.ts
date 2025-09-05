// src/features/nelie/avatar.ts
// Central place for NELIE avatar URL so the whole app uses the *same* asset.

export const NELIE_NAME = "NELIE";

// Valg 1 (anbefalet lige nu): brug en miljøvariabel, fx i .env.local:
//   VITE_NELIE_AVATAR_URL=/nelie.png
//
// Valg 2 (fallback): hvis env ikke er sat, bruger vi /public/nelie.png.
//   Læg et billede (png/webp/jpg) i /public med navnet nelie.png
//   så er URL’en bare /nelie.png.
const fromEnv =
  (import.meta as any)?.env?.VITE_NELIE_AVATAR_URL as string | undefined;

export const NELIE_AVATAR_URL: string =
  fromEnv && fromEnv.trim().length ? fromEnv : "/nelie.png";
