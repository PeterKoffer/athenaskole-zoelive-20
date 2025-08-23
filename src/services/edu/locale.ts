// src/services/edu/locale.ts
export type MeasurementSystem = "metric" | "imperial";
export type EduContext = {
  countryCode: string;     // 'US', 'DK', etc.
  locale: string;          // 'en-US', 'da-DK'
  language: string;        // 'en', 'da'
  currencyCode: string;    // 'USD', 'DKK', ...
  measurement: MeasurementSystem;
  curriculumCode: string;  // 'US-CCSS', 'DK-COMMON', ...
  timezone?: string;
  currencySymbol: string;  // derived via Intl
};

type Preset = {
  locale: string;
  language: string;
  currencyCode: string;
  measurement: MeasurementSystem;
  curriculumCode: string;
  timezone?: string;
};

const PRESETS: Record<string, Preset> = {
  US: { locale: "en-US", language: "en", currencyCode: "USD", measurement: "imperial", curriculumCode: "US-CCSS" },
  DK: { locale: "da-DK", language: "da", currencyCode: "DKK", measurement: "metric",   curriculumCode: "DK-COMMON" },
  GB: { locale: "en-GB", language: "en", currencyCode: "GBP", measurement: "imperial", curriculumCode: "GB-NATCURR" },
  CA: { locale: "en-CA", language: "en", currencyCode: "CAD", measurement: "metric",   curriculumCode: "CA-PROV" },
  AU: { locale: "en-AU", language: "en", currencyCode: "AUD", measurement: "metric",   curriculumCode: "AU-NAT" },
  DE: { locale: "de-DE", language: "de", currencyCode: "EUR", measurement: "metric",   curriculumCode: "DE-LANDER" },
  FR: { locale: "fr-FR", language: "fr", currencyCode: "EUR", measurement: "metric",   curriculumCode: "FR-NAT" },
  ES: { locale: "es-ES", language: "es", currencyCode: "EUR", measurement: "metric",   curriculumCode: "ES-NAT" },
  SE: { locale: "sv-SE", language: "sv", currencyCode: "SEK", measurement: "metric",   curriculumCode: "SE-NAT" },
  NO: { locale: "nb-NO", language: "nb", currencyCode: "NOK", measurement: "metric",   curriculumCode: "NO-NAT" },
  FI: { locale: "fi-FI", language: "fi", currencyCode: "EUR", measurement: "metric",   curriculumCode: "FI-NAT" },
  NL: { locale: "nl-NL", language: "nl", currencyCode: "EUR", measurement: "metric",   curriculumCode: "NL-NAT" },
};

function currencySymbol(code: string, locale: string) {
  try {
    return (0).toLocaleString(locale, { style: "currency", currency: code }).replace(/\d|[.,\s]/g, "");
  } catch {
    return code === "USD" ? "$" : code;
  }
}

export function resolveEduContext(profile: Partial<EduContext & { full_name?: string }>): EduContext {
  const country = (profile.countryCode || "US").toUpperCase();
  const preset = PRESETS[country] ?? PRESETS["US"];
  const locale = profile.locale || preset.locale;
  const language = (profile as any).language || preset.language;
  const currencyCode = profile.currencyCode || preset.currencyCode;
  const measurement = (profile.measurement as MeasurementSystem) || preset.measurement;
  const curriculumCode = profile.curriculumCode || preset.curriculumCode;
  const timezone = profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return {
    countryCode: country,
    locale,
    language,
    currencyCode,
    measurement,
    curriculumCode,
    timezone,
    currencySymbol: currencySymbol(currencyCode, locale),
  };
}