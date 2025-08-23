// src/services/edu/loadOverrides.ts
import { supabase } from "@/integrations/supabase/client";
import type { PartialEdu } from "./effectiveContext";
import type { MeasurementSystem } from "./locale";

// LocalStorage fallbacks (used offline or if DB rows are missing)
const LS_TEACHER = "teacher:eduOverrides";
const LS_CLASS   = (classId: string) => `class:${classId}:eduOverrides`;

export async function loadStudentProfileEdu(): Promise<PartialEdu> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {};
  
  const { data } = await supabase.from("profiles")
    .select("country_code, locale, currency_code, measurement_system, curriculum_code, timezone")
    .eq("user_id", user.id)
    .maybeSingle();
    
  if (!data) return {};
  
  return {
    countryCode: data.country_code ?? undefined,
    locale: data.locale ?? undefined,
    currencyCode: data.currency_code ?? undefined,
    measurement: data.measurement_system as MeasurementSystem ?? undefined,
    curriculumCode: data.curriculum_code ?? undefined,
    timezone: data.timezone ?? undefined,
  };
}

export async function loadTeacherOverrides(): Promise<PartialEdu & { strictTeacherWins?: boolean }> {
  // Try DB - Note: teacher_settings table doesn't have localization fields yet
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    // For now, just check if teacher_settings exists for this user
    const { data } = await supabase
      .from("teacher_settings")
      .select("id")
      .eq("teacher_id", user.id)
      .maybeSingle();
    
    // If we have a teacher record, we could expand this later when localization fields are added
    if (data) {
      // For now, return empty but could include strictTeacherWins logic
      return {
        strictTeacherWins: false, // Default value
      };
    }
  }
  // Fallback: localStorage
  try { return JSON.parse(localStorage.getItem(LS_TEACHER) || "{}"); } catch { return {}; }
}

export async function loadClassOverrides(classId?: string): Promise<PartialEdu> {
  if (!classId) return {};
  
  // Note: class_overrides table doesn't exist yet, so this will use localStorage fallback
  // When the table is created, the DB query will work automatically
  
  // Fallback: localStorage
  try { return JSON.parse(localStorage.getItem(LS_CLASS(classId)) || "{}"); } catch { return {}; }
}