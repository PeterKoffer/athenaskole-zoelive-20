import { useEffect, useMemo, useState } from "react";
import { fetchCalendarRange, createEvent, updateEvent, deleteEvent, CalendarEvent, Audience } from "@/services/calendar";
import { getEffective } from "@/services/settings";

type View = "month"|"week"|"agenda";

export default function CalendarPage() {
  const user = (window as any).__authUser || { id: "me" };
  const orgId = (window as any).__orgId || "school-1";
  const classId = (window as any).__classId || null;
  const roles = (window as any).__roles || [];

  const [tz, setTz] = useState("Europe/Copenhagen");
  const [cursor, setCursor] = useState(new Date());        // current focus date
  const [view, setView] = useState<View>("month");
  const [layers, setLayers] = useState<Record<Audience, boolean>>({ staff: true, students: true, family: true });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<null | (Partial<CalendarEvent> & { isNew?: boolean })>(null);

  // timezone from settings
  useEffect(() => { (async () => {
    try {
      const r = await getEffective<{ tz: string }>("class.timezone", { orgId, classId, userId: user.id, roles }, { fallback: { tz: "Europe/Copenhagen" }});
      setTz(r?.tz ?? "Europe/Copenhagen");
    } catch (error) {
      console.error("Failed to fetch timezone:", error);
      setTz("Europe/Copenhagen");
    }
  })(); }, [orgId, classId, user?.id]);

  // fetch current range
  const { fromISO, toISO } = useMemo(() => rangeFor(view, cursor, tz), [view, cursor, tz]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchCalendarRange({ orgId, classId, fromISO, toISO });
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [orgId, classId, fromISO, toISO]);

  const filtered = useMemo(() => {
    const keep = new Set<Audience>(Object.entries(layers).filter(([,v])=>v).map(([k])=>k as Audience));
    return events.filter(e => e.audiences.some(a => keep.has(a)));
  }, [events, layers]);

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-4 bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-xl md:text-2xl font-semibold text-foreground">Calendar</div>
        <div className="ml-auto flex items-center gap-2">
          <button className="px-3 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" onClick={()=>setCursor(new Date())}>Today</button>
          <button className="px-3 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" onClick={()=>setCursor(addDays(cursor, view === "month" ? -28 : -7))}>◀</button>
          <button className="px-3 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" onClick={()=>setCursor(addDays(cursor, view === "month" ? +28 : +7))}>▶</button>
          <select value={view} onChange={e=>setView(e.target.value as View)} className="px-3 py-2 border border-border rounded-md bg-background text-foreground">
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="agenda">Agenda</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(["staff","students","family"] as Audience[]).map(a => (
          <label key={a} className={`text-sm px-3 py-2 border border-border rounded-md cursor-pointer transition-colors ${layers[a] ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent hover:text-accent-foreground"}`}>
            <input type="checkbox" className="mr-2" checked={layers[a]} onChange={e=>setLayers(prev=>({ ...prev, [a]: e.target.checked }))}/>
            {a}
          </label>
        ))}
        <div className="ml-auto text-sm text-muted-foreground">Timezone: {tz}</div>
        <button className="px-3 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" onClick={()=>setEditing(defaultNew(cursor))}>+ Add event</button>
        <button className="px-3 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" onClick={()=>downloadICS(filtered)}>Export .ics</button>
      </div>

      {/* Views */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        {loading ? <div className="p-6 text-sm text-muted-foreground">Loading…</div> : null}
        {!loading && view === "month" && (
          <MonthView tz={tz} date={cursor} events={filtered} onAdd={(d)=>setEditing(defaultNew(d))} onEdit={(e)=>setEditing(e)} />
        )}
        {!loading && view === "week" && (
          <WeekView tz={tz} date={cursor} events={filtered} onAdd={(d)=>setEditing(defaultNew(d))} onEdit={(e)=>setEditing(e)} />
        )}
        {!loading && view === "agenda" && (
          <AgendaView tz={tz} events={filtered} onEdit={(e)=>setEditing(e)} />
        )}
      </div>

      {/* Modal */}
      {editing && (
        <EventModal
          initial={editing}
          readOnly={editing.source === "plan"}
          onClose={()=>setEditing(null)}
          onDelete={editing.id && editing.source !== "plan" ? async ()=>{ await deleteEvent(editing.id!); setEditing(null); refresh(); } : undefined}
          onSave={async (data) => {
            if (editing.isNew && data.title) {
              await createEvent({ 
                org_id: orgId, 
                created_by: user.id, 
                class_id: classId ?? null,
                title: data.title,
                details: data.details ?? null,
                starts_at: data.starts_at!,
                ends_at: data.ends_at!,
                all_day: data.all_day ?? false,
                location: data.location ?? null,
                color: data.color ?? null,
                audiences: data.audiences ?? ["staff","students","family"],
                rrule: data.rrule ?? null
              });
            } else if (editing.id) {
              await updateEvent(editing.id, data);
            }
            setEditing(null);
            refresh();
          }}
        />
      )}
    </div>
  );

  function refresh(){ (async () => {
    setLoading(true);
    try { 
      const data = await fetchCalendarRange({ orgId, classId, fromISO, toISO });
      setEvents(data);
    } catch (error) {
      console.error("Failed to refresh calendar events:", error);
      setEvents([]);
    } finally { 
      setLoading(false); 
    }
  })(); }
}

/* ---------- Views ---------- */

function MonthView({ tz, date, events, onAdd, onEdit }:{
  tz:string; date:Date; events:CalendarEvent[];
  onAdd:(d:Date)=>void; onEdit:(e:CalendarEvent)=>void;
}) {
  const start = startOfMonthGrid(date);
  const days: Date[] = Array.from({length: 42}, (_,i)=>addDays(start, i));
  const fmtDay = new Intl.DateTimeFormat(undefined, { timeZone: tz, day: "numeric" });
  const month = date.getUTCMonth();

  const dayEvents = (d:Date) => events.filter(e => sameDayTZ(e.starts_at, d, tz));

  return (
    <div className="grid grid-cols-7 border-t border-border text-sm">
      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
        <div key={d} className="p-2 bg-muted border-r border-border font-medium text-muted-foreground">{d}</div>
      ))}
      {days.map((d,i)=>(
        <div key={i} className={`min-h-[110px] border-t border-r border-border p-1 align-top ${d.getUTCMonth()===month ? "bg-card" : "bg-muted/50"}`}>
          <div className="flex items-center justify-between mb-1">
            <button className="text-xs px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" onClick={()=>onAdd(d)}>{fmtDay.format(d)}</button>
          </div>
          <div className="space-y-1">
            {dayEvents(d).slice(0,4).map(e => (
              <button key={e.id} className={`w-full text-left px-2 py-1 rounded-md text-xs transition-colors ${e.source==='plan' ? "bg-cyan-100 text-cyan-900 border border-cyan-200 hover:bg-cyan-200" : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"}`}
                      title={e.details ?? ""} onClick={()=>onEdit(e)}>
                <span className="truncate block font-medium">{e.title}</span>
              </button>
            ))}
            {dayEvents(d).length > 4 && <div className="text-xs text-muted-foreground px-1">+{dayEvents(d).length - 4} more…</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function WeekView({ tz, date, events, onAdd, onEdit }:{
  tz:string; date:Date; events:CalendarEvent[];
  onAdd:(d:Date)=>void; onEdit:(e:CalendarEvent)=>void;
}) {
  const start = startOfWeek(date);
  const days = Array.from({length:7}, (_,i)=>addDays(start,i));
  const fmt = new Intl.DateTimeFormat(undefined, { timeZone: tz, weekday:"short", month:"short", day:"numeric" });

  const allDay = events.filter(e => e.all_day);
  const timed   = events.filter(e => !e.all_day);

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-7 bg-muted border-b border-border">
        {days.map((d,i)=>(
          <div key={i} className="p-2 text-sm font-medium border-r border-border text-muted-foreground">{fmt.format(d)}</div>
        ))}
      </div>
      {/* All-day lane */}
      <div className="grid grid-cols-7 border-b border-border">
        {days.map((d,i)=>(
          <div key={i} className="min-h-[48px] border-r border-border p-1">
            {allDay.filter(e=>sameDayTZ(e.starts_at, d, tz)).map(e=>(
              <button key={e.id} className={`w-full text-left px-2 py-1 rounded-md text-xs transition-colors ${e.source==='plan' ? "bg-cyan-100 text-cyan-900 border border-cyan-200 hover:bg-cyan-200" : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"}`}
                      onClick={()=>onEdit(e)}>{e.title}</button>
            ))}
          </div>
        ))}
      </div>
      {/* Hour grid (08–17) */}
      <div className="grid grid-cols-[60px_1fr]">
        <div className="border-r border-border">
          {Array.from({length:10},(_,i)=>8+i).map(h=>(<div key={h} className="h-16 text-xs text-right pr-2 border-b border-border text-muted-foreground flex items-center justify-end">{h}:00</div>))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d,i)=>(
            <div key={i} className="border-r border-border">
              {Array.from({length:10},(_,k)=>8+k).map(h=>(
                <div key={h} className="h-16 border-b border-border relative group">
                  <button className="absolute inset-0 opacity-0 group-hover:opacity-100 text-xs text-left px-1 hover:bg-accent/50 transition-opacity"
                          onClick={()=>onAdd(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), h, 0, 0)))}>+ add</button>
                </div>
              ))}
              {/* render timed events for this day */}
              {timed.filter(e=>sameDayTZ(e.starts_at, d, tz)).map(e=>{
                const startH = hourInTZ(e.starts_at, tz);
                const endH   = hourInTZ(e.ends_at, tz);
                const top = (startH-8)*64;           // 64px per hour
                const height = Math.max(48, (endH - startH)*64);
                return (
                  <button key={e.id}
                    className={`absolute left-0 right-1 mx-1 px-2 text-left rounded-md shadow-sm transition-colors ${e.source==='plan' ? "bg-cyan-100 text-cyan-900 hover:bg-cyan-200" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
                    style={{ top, height }}
                    onClick={()=>onEdit(e)}>
                    <div className="text-xs font-medium truncate">{e.title}</div>
                    <div className="text-[11px] opacity-75 truncate">{timeRange(e.starts_at,e.ends_at,tz)}</div>
                  </button>
                );
              })}
              <div className="relative" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgendaView({ tz, events, onEdit }:{ tz:string; events:CalendarEvent[]; onEdit:(e:CalendarEvent)=>void }) {
  const byDay = groupBy(events, e => new Intl.DateTimeFormat(undefined,{ timeZone: tz, year:"numeric", month:"2-digit", day:"2-digit" }).format(new Date(e.starts_at)));
  return (
    <div className="divide-y divide-border">
      {Object.entries(byDay).map(([day, list])=>(
        <div key={day} className="p-3">
          <div className="text-sm font-medium mb-2 text-foreground">{day}</div>
          <ul className="space-y-2">
            {list.map(e=>(
              <li key={e.id}>
                <button className={`w-full text-left px-3 py-2 rounded-md border transition-colors ${e.source==='plan'?"border-cyan-200 bg-cyan-50 hover:bg-cyan-100":"border-border bg-card hover:bg-accent"}`} onClick={()=>onEdit(e)}>
                  <div className="font-medium text-foreground">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{e.all_day ? "All day" : timeRange(e.starts_at,e.ends_at,tz)} • {e.audiences.join(", ")}</div>
                  {e.details && <div className="text-sm text-muted-foreground mt-1">{e.details}</div>}
                </button>
              </li>
            ))}
            {list.length===0 && <li className="text-sm text-muted-foreground">No events</li>}
          </ul>
        </div>
      ))}
      {Object.keys(byDay).length===0 && <div className="p-4 text-sm text-muted-foreground">No events in range.</div>}
    </div>
  );
}

/* ---------- Modal ---------- */

function EventModal({ initial, readOnly, onClose, onSave, onDelete }:{
  initial: Partial<CalendarEvent> & { isNew?: boolean };
  readOnly?: boolean;
  onClose: ()=>void;
  onSave: (patch: Partial<CalendarEvent>)=>Promise<void>;
  onDelete?: ()=>Promise<void>;
}) {
  const [title, setTitle] = useState(initial.title ?? "");
  const [details, setDetails] = useState(initial.details ?? "");
  const [allDay, setAllDay] = useState(!!initial.all_day);
  const [start, setStart] = useState(toLocalInput(initial.starts_at));
  const [end, setEnd] = useState(toLocalInput(initial.ends_at));
  const [location, setLocation] = useState(initial.location ?? "");
  const [aud, setAud] = useState<Record<Audience,boolean>>({
    staff: initial.audiences?.includes("staff") ?? true,
    students: initial.audiences?.includes("students") ?? true,
    family: initial.audiences?.includes("family") ?? true
  });

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="font-medium text-foreground">{readOnly ? "View event" : (initial.isNew ? "Add event" : "Edit event")}</div>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={onClose}>✕</button>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <label className="block">
            <span className="text-foreground font-medium">Title</span>
            <input className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground" value={title} onChange={e=>setTitle(e.target.value)} disabled={readOnly}/>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="text-foreground font-medium">Start</span>
              <input type="datetime-local" className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground" value={start} onChange={e=>setStart(e.target.value)} disabled={readOnly}/>
            </label>
            <label>
              <span className="text-foreground font-medium">End</span>
              <input type="datetime-local" className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground" value={end} onChange={e=>setEnd(e.target.value)} disabled={readOnly}/>
            </label>
          </div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={allDay} onChange={e=>setAllDay(e.target.checked)} disabled={readOnly}/>
            <span className="text-foreground">All day</span>
          </label>
          <label className="block">
            <span className="text-foreground font-medium">Location</span>
            <input className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground" value={location} onChange={e=>setLocation(e.target.value)} disabled={readOnly}/>
          </label>
          <label className="block">
            <span className="text-foreground font-medium">Details</span>
            <textarea className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background text-foreground" rows={3} value={details} onChange={e=>setDetails(e.target.value)} disabled={readOnly}/>
          </label>
          <div className="space-y-2">
            <span className="text-foreground font-medium">Audiences</span>
            <div className="flex flex-wrap gap-2">
              {(["staff","students","family"] as Audience[]).map(a=>(
                <label key={a} className={`px-3 py-2 border border-border rounded-md cursor-pointer transition-colors ${aud[a]?"bg-primary text-primary-foreground":"bg-background hover:bg-accent"}`}>
                  <input type="checkbox" className="mr-2" checked={aud[a]} onChange={e=>setAud(p=>({ ...p, [a]: e.target.checked }))} disabled={readOnly}/>
                  {a}
                </label>
              ))}
            </div>
          </div>
          {initial.source === "plan" && (
            <div className="text-xs p-3 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-900">
              This item comes from a published lesson plan and is read-only here.
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          {onDelete && !readOnly ? (
            <button className="text-destructive hover:underline transition-colors" onClick={onDelete}>Delete</button>
          ) : <span />}
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors" onClick={onClose}>Cancel</button>
            {!readOnly && (
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                onClick={async ()=>{
                  await onSave({
                    title,
                    details,
                    all_day: allDay,
                    location,
                    audiences: (Object.entries(aud).filter(([,v])=>v).map(([k])=>k) as Audience[]),
                    starts_at: toUTC(start),
                    ends_at: toUTC(end)
                  });
                }}>Save</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function rangeFor(view:View, cursor:Date, _tz:string){
  const start = view==="month" ? startOfMonthGrid(cursor) : startOfWeek(cursor);
  const end   = new Date(start);
  end.setUTCDate(end.getUTCDate() + (view==="month" ? 41 : 6));
  end.setUTCHours(23,59,59,999);
  return { fromISO: start.toISOString(), toISO: end.toISOString() };
}

function startOfMonthGrid(d:Date){
  const first = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  const dow = (first.getUTCDay()+6)%7; // Mon=0
  first.setUTCDate(first.getUTCDate()-dow);
  first.setUTCHours(0,0,0,0);
  return first;
}
function startOfWeek(d:Date){
  const copy = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dow = (copy.getUTCDay()+6)%7;
  copy.setUTCDate(copy.getUTCDate()-dow);
  copy.setUTCHours(0,0,0,0);
  return copy;
}
function addDays(d:Date, n:number){ const x=new Date(d); x.setUTCDate(x.getUTCDate()+n); return x; }
function groupBy<T>(list:T[], key:(t:T)=>string){ return list.reduce<Record<string,T[]>>((acc,cur)=>{ const k=key(cur); (acc[k]??=[]).push(cur); return acc; },{}); }
function sameDayTZ(iso:string, d:Date, tz:string){
  const fmt = new Intl.DateTimeFormat(undefined,{ timeZone: tz, year:"numeric", month:"2-digit", day:"2-digit" });
  return fmt.format(new Date(iso)) === fmt.format(d);
}
function hourInTZ(iso:string, tz:string){
  return Number(new Intl.DateTimeFormat(undefined,{ timeZone: tz, hour: "numeric", hour12:false }).format(new Date(iso)));
}
function timeRange(a:string,b:string,tz:string){
  const f = new Intl.DateTimeFormat(undefined,{ timeZone: tz, hour:"2-digit", minute:"2-digit" });
  return `${f.format(new Date(a))} – ${f.format(new Date(b))}`;
}
function defaultNew(anchor: Date): Partial<CalendarEvent> & { isNew: true }{
  const start = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), anchor.getUTCDate(), 9, 0, 0));
  const end   = new Date(start); end.setUTCHours(10);
  return { isNew: true, title: "New event", audiences:["staff","students","family"], starts_at: start.toISOString(), ends_at: end.toISOString(), all_day:false };
}
function toLocalInput(iso?: string){ if(!iso) return ""; const d = new Date(iso); const pad=(n:number)=>String(n).padStart(2,"0"); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; }
function toUTC(local:string){ if(!local) return new Date().toISOString(); const d=new Date(local); return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0)).toISOString(); }

/* ICS export (basic) */
function downloadICS(evts: CalendarEvent[]){
  const esc = (s:string)=>String(s||"").replace(/(\r\n|\n|\r)/g,"\\n");
  const lines = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Nelie//School Calendar//EN"
  ];
  for (const e of evts) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}@nelie`,
      `DTSTAMP:${toICS(new Date())}`,
      `DTSTART:${toICS(new Date(e.starts_at))}`,
      `DTEND:${toICS(new Date(e.ends_at))}`,
      `SUMMARY:${esc(e.title)}`,
      e.details ? `DESCRIPTION:${esc(e.details)}` : "",
      e.location ? `LOCATION:${esc(e.location)}` : "",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.filter(Boolean).join("\r\n")], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "calendar.ics"; a.click();
  URL.revokeObjectURL(url);
}
function toICS(d:Date){
  const pad=(n:number)=>String(n).padStart(2,"0");
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}