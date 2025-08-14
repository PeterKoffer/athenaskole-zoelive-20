import { useEffect, useMemo, useState } from "react";
import { fetchCalendarRange, type CalendarEvent } from "@/services/calendar";
import { getEffective } from "@/services/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function CalendarPage() {
  // TODO: Replace with actual auth user, orgId, classId, roles from your auth context
  const user = { id: "demo-user" };
  const orgId = "demo-org";
  const classId = null;
  const roles = ["teacher"];

  const [tz, setTz] = useState<string>("UTC");
  const [fromISO, setFromISO] = useState(() => todayStartISO());
  const [toISO, setToISO] = useState(() => plusDaysISO(7));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [layers, setLayers] = useState<{staff:boolean;students:boolean;family:boolean}>({
    staff: true, 
    students: true, 
    family: true
  });

  useEffect(() => { 
    (async () => {
      try {
        const r = await getEffective<{ tz: string }>(
          "class.timezone", 
          { orgId, classId, userId: user.id, roles }, 
          { fallback: { tz: "Europe/Copenhagen" }}
        );
        setTz(r?.tz ?? "Europe/Copenhagen");
      } catch (error) {
        console.error("Failed to fetch timezone:", error);
        setTz("Europe/Copenhagen");
      }
    })(); 
  }, [orgId, classId, user?.id]);

  useEffect(() => { 
    (async () => {
      try {
        const data = await fetchCalendarRange({ orgId, classId, fromISO, toISO });
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
        setEvents([]);
      }
    })(); 
  }, [orgId, classId, fromISO, toISO]);

  const filtered = useMemo(() => {
    const keep = new Set<string>(
      ["staff","students","family"].filter(k => (layers as any)[k])
    );
    return events.filter(e => e.audiences.some((a:string)=>keep.has(a)));
  }, [events, layers]);

  const days = groupByDay(filtered, tz);

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <div className="text-sm text-muted-foreground">TZ: {tz}</div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="from-date">From</Label>
                <Input 
                  id="from-date"
                  type="date" 
                  value={fromISO.slice(0,10)} 
                  onChange={e=>setFromISO(e.target.value+"T00:00:00Z")} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to-date">To</Label>
                <Input 
                  id="to-date"
                  type="date" 
                  value={toISO.slice(0,10)} 
                  onChange={e=>setToISO(e.target.value+"T23:59:59Z")} 
                />
              </div>
              
              <div className="flex items-center gap-4 ml-auto">
                <Label className="text-sm font-medium">Audiences:</Label>
                {(["staff","students","family"] as const).map(k => (
                  <div key={k} className="flex items-center space-x-2">
                    <Checkbox 
                      id={k}
                      checked={(layers as any)[k]}
                      onCheckedChange={(checked) => setLayers(prev => ({ ...prev, [k]: !!checked }))}
                    />
                    <Label htmlFor={k} className="text-sm capitalize">{k}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {Object.entries(days).map(([d, list]) => (
            <Card key={d}>
              <CardHeader>
                <CardTitle className="text-lg">{formatDay(d)}</CardTitle>
              </CardHeader>
              <CardContent>
                {list.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events</p>
                ) : (
                  <div className="space-y-3">
                    {list.map((e:CalendarEvent) => (
                      <div key={e.id} className="flex items-start justify-between p-3 border rounded-lg bg-card">
                        <div className="space-y-1">
                          <h4 className="font-medium text-foreground">{e.title}</h4>
                          {e.details && (
                            <p className="text-sm text-muted-foreground">{e.details}</p>
                          )}
                          <div className="text-xs text-muted-foreground space-x-2">
                            <span>{fmtTime(e.starts_at, tz)}–{fmtTime(e.ends_at, tz)}</span>
                            <span>•</span>
                            <span>{e.source === "plan" ? "Lesson plan" : "Event"}</span>
                            <span>•</span>
                            <span>{e.audiences.join(", ")}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function todayStartISO(){ 
  const d = new Date(); 
  d.setUTCHours(0,0,0,0); 
  return d.toISOString(); 
}

function plusDaysISO(n: number){ 
  const d = new Date(); 
  d.setUTCDate(d.getUTCDate() + n); 
  d.setUTCHours(23,59,59,999); 
  return d.toISOString(); 
}

function groupByDay(items: CalendarEvent[], tz: string) {
  const fmt = new Intl.DateTimeFormat(undefined, { 
    timeZone: tz, 
    year: "numeric", 
    month: "2-digit", 
    day: "2-digit" 
  });
  
  const g: Record<string, CalendarEvent[]> = {};
  for (const e of items) {
    const key = fmt.format(new Date(e.starts_at)); 
    (g[key] ??= []).push(e);
  }
  return g;
}

function fmtTime(iso: string, tz: string) { 
  return new Intl.DateTimeFormat(undefined, { 
    timeZone: tz, 
    hour: "2-digit", 
    minute: "2-digit" 
  }).format(new Date(iso)); 
}

function formatDay(label: string) { 
  return label; 
}