import { supabase } from "@/lib/supabaseClient";

export type Audience = "staff"|"students"|"family";
export type CalendarEvent = {
  id: string;
  org_id: string;
  class_id?: string | null;
  title: string;
  details?: string | null;
  starts_at: string;  // ISO
  ends_at: string;    // ISO
  all_day?: boolean;
  location?: string | null;
  color?: string | null;
  audiences: Audience[];
  rrule?: string | null;
  source: "calendar" | "plan";
};

export async function fetchCalendarRange(params: {
  orgId: string; classId?: string | null; fromISO: string; toISO: string;
}) {
  const { orgId, classId, fromISO, toISO } = params;

  // 1) School calendar events
  let q = supabase.from("calendar_events")
    .select("*")
    .eq("org_id", orgId)
    .gte("starts_at", fromISO)
    .lte("starts_at", toISO)
    .order("starts_at", { ascending: true });

  if (classId) q = q.eq("class_id", classId);

  const { data: rows = [], error } = await q;
  if (error) console.warn("calendar fetch error", error);

  const events: CalendarEvent[] = (rows || []).map((r: any) => ({
    id: r.id, org_id: r.org_id, class_id: r.class_id,
    title: r.title, details: r.details,
    starts_at: r.starts_at, ends_at: r.ends_at,
    all_day: r.all_day ?? false, location: r.location ?? null,
    color: r.color ?? null,
    audiences: r.audiences ?? ["staff","students","family"],
    rrule: r.rrule ?? null,
    source: "calendar"
  }));

  // 2) Read-only lesson plans for those days (future integration)
  const planEvents: CalendarEvent[] = [];

  // (Optional) simple weekly RRULE expansion (WEEKLY on same weekday)
  const expanded: CalendarEvent[] = [];
  for (const e of events) {
    if (!e.rrule) { expanded.push(e); continue; }
    const rule = e.rrule.toUpperCase();
    if (!rule.startsWith("FREQ=WEEKLY")) { expanded.push(e); continue; }

    const start = new Date(e.starts_at);
    const end   = new Date(e.ends_at);
    const from  = new Date(fromISO);
    const to    = new Date(toISO);

    // move start forward to 'from' week boundary
    let curStart = new Date(start);
    while (curStart < from) curStart.setUTCDate(curStart.getUTCDate() + 7);

    while (curStart <= to) {
      const dur = end.getTime() - start.getTime();
      const curEnd = new Date(curStart.getTime() + dur);
      expanded.push({ ...e, id: `${e.id}:${curStart.toISOString().slice(0,10)}`, starts_at: curStart.toISOString(), ends_at: curEnd.toISOString() });
      curStart.setUTCDate(curStart.getUTCDate() + 7);
    }
  }

  return [...expanded, ...planEvents].sort((a,b) => a.starts_at.localeCompare(b.starts_at));
}

export async function createEvent(input: Omit<CalendarEvent, "id"|"source"> & { created_by: string }) {
  const { data, error } = await supabase.from("calendar_events").insert({
    org_id: input.org_id,
    class_id: input.class_id ?? null,
    title: input.title,
    details: input.details ?? null,
    starts_at: input.starts_at,
    ends_at: input.ends_at,
    all_day: !!input.all_day,
    location: input.location ?? null,
    color: input.color ?? null,
    audiences: input.audiences ?? ["staff","students","family"],
    rrule: input.rrule ?? null,
    created_by: input.created_by
  }).select("id").single();
  if (error) throw error;
  return data?.id as string;
}

export async function updateEvent(id: string, patch: Partial<Omit<CalendarEvent,"id"|"source">>) {
  const { error } = await supabase.from("calendar_events").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from("calendar_events").delete().eq("id", id);
  if (error) throw error;
}