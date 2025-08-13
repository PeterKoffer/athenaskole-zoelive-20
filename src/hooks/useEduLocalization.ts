import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { resolveEduContext } from "@/services/edu/locale";
import { fmtCurrency, fmtDistanceKm, fmtDistanceMeters, fmtTemperatureC, fmtDateISO } from "@/services/edu/format";
import { applyEduTokens } from "@/services/edu/textTokens";

interface ProfileData {
  country_code?: string | null;
  locale?: string | null;
  currency_code?: string | null;
  measurement_system?: string | null;
  curriculum_code?: string | null;
  timezone?: string | null;
}

export function useEduLocalization(profileOverride?: ProfileData) {
  const { user } = useAuth();
  
  const eduContext = useMemo(() => {
    // TODO: Get actual profile data from user context or props
    const profile = profileOverride || {
      country_code: "US", // Default fallback
      locale: null,
      currency_code: null,
      measurement_system: null,
      curriculum_code: null,
      timezone: null
    };

    return resolveEduContext({
      countryCode: profile.country_code || undefined,
      locale: profile.locale || undefined,
      currencyCode: profile.currency_code || undefined,
      measurement: profile.measurement_system as any || undefined,
      curriculumCode: profile.curriculum_code || undefined,
      timezone: profile.timezone || undefined,
    });
  }, [profileOverride, user]);

  const formatters = useMemo(() => ({
    currency: (value: number) => fmtCurrency(value, eduContext),
    distanceKm: (value: number) => fmtDistanceKm(value, eduContext),
    distanceMeters: (value: number) => fmtDistanceMeters(value, eduContext),
    temperature: (value: number) => fmtTemperatureC(value, eduContext),
    date: (iso: string) => fmtDateISO(iso, eduContext),
  }), [eduContext]);

  const applyTokens = useMemo(() => 
    (text: string) => applyEduTokens(text, eduContext),
    [eduContext]
  );

  return {
    eduContext,
    formatters,
    applyTokens,
  };
}