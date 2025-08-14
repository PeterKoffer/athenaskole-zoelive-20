import { supabase } from "@/integrations/supabase/client";

export type CalendarEvent = {
  id: string;
  title: string;
  details?: string | null;
  starts_at: string; // ISO
  ends_at: string;   // ISO
  audiences: string[]; // ["staff","students","family"]
  source: "calendar" | "plan";
  class_id?: string | null;
};

export async function fetchCalendarRange(params: {
  orgId: string; 
  classId?: string | null; 
  fromISO: string; 
  toISO: string;
}) {
  const { orgId, classId, fromISO, toISO } = params;

  // 1) Raw calendar events
  let qry = supabase.from("calendar_events")
    .select("*")
    .eq("org_id", orgId)
    .gte("starts_at", fromISO)
    .lte("starts_at", toISO)
    .order("starts_at", { ascending: true });

  if (classId) {
    qry = qry.eq("class_id", classId);
  }
  
  const { data: evts = [] } = await qry;

  // 2) Pull published class plans (treat as student-facing events)
  // Note: Commenting out class_plans integration until table exists
  // const { data: plans = [] } = await supabase.from("class_plans")
  //   .select("org_id,class_id,plan_date,lesson")
  //   .eq("org_id", orgId)
  //   .gte("plan_date", fromISO.slice(0,10))
  //   .lte("plan_date", toISO.slice(0,10))
  //   .order("plan_date", { ascending: true });
  const plans: any[] = []; // Temporary fallback

  const planEvents: CalendarEvent[] = (plans || []).map((p: any) => {
    const d = p.plan_date; // YYYY-MM-DD
    // default to school-day 09:00–12:00; UI can adjust later
    const start = `${d}T09:00:00Z`;
    const end   = `${d}T12:00:00Z`;
    const title = p.lesson?.hero?.title ?? "Planned Lesson";
    return {
      id: `plan:${p.org_id}:${p.class_id}:${d}`,
      title,
      details: p.lesson?.hero?.subtitle ?? p.lesson?.hero?.subject ?? null,
      starts_at: start,
      ends_at: end,
      audiences: ["students","family","staff"],
      source: "plan" as const,
      class_id: p.class_id
    };
  });

  const calEvents: CalendarEvent[] = (evts || []).map((e: any) => ({
    id: e.id, 
    title: e.title, 
    details: e.details,
    starts_at: e.starts_at, 
    ends_at: e.ends_at,
    audiences: e.audiences ?? ["staff","students","family"],
    source: "calendar" as const, 
    class_id: e.class_id
  }));

  return [...calEvents, ...planEvents].sort((a,b) => a.starts_at.localeCompare(b.starts_at));
}