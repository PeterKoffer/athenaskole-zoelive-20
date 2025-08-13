// src/services/edu/format.ts
import { EduContext } from "./locale";

export const kmToMiles = (km: number) => km * 0.621371;
export const mToFeet = (m: number) => m * 3.28084;
export const cToF = (c: number) => (c * 9) / 5 + 32;

export function fmtCurrency(value: number, ctx: EduContext) {
  return value.toLocaleString(ctx.locale, { style: "currency", currency: ctx.currencyCode });
}

export function fmtDistanceMeters(valueMeters: number, ctx: EduContext) {
  if (ctx.measurement === "imperial") {
    const feet = mToFeet(valueMeters);
    return `${feet.toFixed(0)} ft`;
  }
  return `${valueMeters.toFixed(0)} m`;
}

export function fmtDistanceKm(valueKm: number, ctx: EduContext) {
  if (ctx.measurement === "imperial") {
    const miles = kmToMiles(valueKm);
    return `${miles.toFixed(1)} mi`;
  }
  return `${valueKm.toFixed(1)} km`;
}

export function fmtTemperatureC(valueC: number, ctx: EduContext) {
  if (ctx.measurement === "imperial") {
    return `${cToF(valueC).toFixed(0)} °F`;
  }
  return `${valueC.toFixed(0)} °C`;
}

export function fmtDateISO(iso: string, ctx: EduContext) {
  try {
    return new Date(iso).toLocaleDateString(ctx.locale);
  } catch { return iso; }
}