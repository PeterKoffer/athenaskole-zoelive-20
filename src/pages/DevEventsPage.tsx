import React from "react";
import { supabase } from "@/integrations/supabase/client";

// Dev-only page listing recent telemetry events with counters, filter, auto-refresh, and CSV export
// Route at "/dev/events" (page self-guards in production)

type EventRow = {
  id: string;
  created_at: string; // ISO
  name: string;
  session_id: string | null;
  payload: Record<string, any>;
};

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - d) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  const m = diff / 60;
  if (m < 60) return `${Math.floor(m)}m ago`;
  const h = m / 60;
  if (h < 24) return `${Math.floor(h)}h ago`;
  const days = h / 24;
  return `${Math.floor(days)}d ago`;
}

function toCSV(rows: EventRow[]) {
  const header = ["created_at", "name", "session_id", "payload"];
  const lines = rows.map((r) => {
    const payload = JSON.stringify(r.payload ?? {});
    const cells = [r.created_at, r.name, r.session_id ?? "", payload].map((v) =>
      `"${String(v).replace(/"/g, '""')}"`
    );
    return cells.join(",");
  });
  return "\uFEFF" + [header.join(","), ...lines].join("\r\n");
}

export default function DevEventsPage() {
  // Guard: dev only
  if (!import.meta.env.DEV) return null;

  const [rows, setRows] = React.useState<EventRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [raw, setRaw] = React.useState("");
  const [filter, setFilter] = React.useState("");
  const [autoRefresh, setAutoRefresh] = React.useState(true);
  const [lastRefresh, setLastRefresh] = React.useState<Date | null>(null);
  const [limit, setLimit] = React.useState(200);
  const [sinceMin, setSinceMin] = React.useState(30);
  const [live, setLive] = React.useState(true);
  const fetching = React.useRef(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const thirtyMinAgoIso = React.useMemo(
    () => new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    []
  );
  const todayStartIso = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }, []);

  const refresh = React.useCallback(async () => {
    if (fetching.current) return;
    fetching.current = true;
    try {
      setLoading(true);
      setError(null);
      const sinceISO = new Date(Date.now() - sinceMin * 60_000).toISOString();
      const { data, error } = await (supabase as any)
        .from("events")
        .select("id, created_at, name, session_id, payload")
        .gte("created_at", sinceISO)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      setRows((data || []) as EventRow[]);
      setLastRefresh(new Date());
    } catch (e: any) {
      setError(e?.message ?? "Failed to load events");
    } finally {
      setLoading(false);
      fetching.current = false;
    }
  }, [limit, sinceMin]);

  React.useEffect(() => {
    document.title = "Dev · Events";
    refresh();
  }, [refresh]);

  // Init from URL and localStorage
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("session");
      if (s) setRaw(s);
    } catch {}
    try {
      const saved = localStorage.getItem("devEventsControls");
      if (saved) {
        const obj = JSON.parse(saved);
        if (typeof obj.limit === "number") setLimit(obj.limit);
        if (typeof obj.sinceMin === "number") setSinceMin(obj.sinceMin);
        if (typeof obj.raw === "string") setRaw(obj.raw);
      }
    } catch {}
  }, []);

  // Persist controls
  React.useEffect(() => {
    try {
      localStorage.setItem("devEventsControls", JSON.stringify({ limit, sinceMin, raw }));
    } catch {}
  }, [limit, sinceMin, raw]);

  React.useEffect(() => {
    if (!autoRefresh) return;
    const id = window.setInterval(() => refresh(), 10_000);
    return () => window.clearInterval(id);
  }, [autoRefresh, refresh]);

  // Debounce filter input
  React.useEffect(() => {
    const t = window.setTimeout(() => setFilter(raw.trim().toLowerCase()), 250);
    return () => window.clearTimeout(t);
  }, [raw]);

  // Hotkey: focus filter with '/'
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/") { e.preventDefault(); inputRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Realtime inserts
  React.useEffect(() => {
    const channel = (supabase as any)
      .channel("events-inserts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "events" }, (payload: any) => {
        if (!live) return;
        setRows((prev) => {
          const incoming = payload.new as EventRow;
          if (prev.some((p) => p.id === incoming.id)) return prev; // dedupe
          const next = [incoming, ...prev];
          return next.slice(0, limit); // cap
        });
      })
      .subscribe();
    return () => { (supabase as any).removeChannel(channel); };
  }, [limit, live]);

  const filtered = React.useMemo(() => {
    const q = filter.trim();
    if (!q) return rows;
    return rows.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      (r.session_id ?? "").toLowerCase().includes(q) ||
      JSON.stringify(r.payload).toLowerCase().includes(q)
    );
  }, [rows, filter]);

  const last30 = React.useMemo(
    () => rows.filter((r) => r.created_at >= thirtyMinAgoIso),
    [rows, thirtyMinAgoIso]
  );
  const today = React.useMemo(
    () => rows.filter((r) => r.created_at >= todayStartIso),
    [rows, todayStartIso]
  );
  const topLast30 = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const r of last30) m.set(r.name, (m.get(r.name) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [last30]);

  const onExportCSV = () => {
    const csv = toCSV(filtered);
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const name = `events-${stamp}.csv`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <header className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-semibold">Dev · Events</h1>
        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">RLS active</span>
        <div className="ml-auto flex items-center gap-3">
          <label className="text-sm flex items-center gap-2 select-none">
            <input
              type="checkbox"
              className="accent-current"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh (10s)
          </label>
          <label className="text-sm flex items-center gap-2 select-none">
            <input
              type="checkbox"
              className="accent-current"
              checked={live}
              onChange={(e) => setLive(e.target.checked)}
            />
            Live
          </label>
          <button
            className={`px-3 py-1.5 rounded border text-sm ${
              loading ? "opacity-60 cursor-wait" : "hover:bg-muted"
            }`}
            onClick={refresh}
            disabled={loading}
            title="Refresh"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button
            className="px-3 py-1.5 rounded border text-sm hover:bg-muted"
            onClick={onExportCSV}
            title="Export current view to CSV"
          >
            Export CSV
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded p-3">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="rounded-2xl border p-4 bg-card">
          <div className="text-muted-foreground text-xs">Last 30 min</div>
          <div className="text-2xl font-semibold">{last30.length}</div>
          <div className="text-xs text-muted-foreground mt-1">events</div>
        </div>
        <div className="rounded-2xl border p-4 bg-card">
          <div className="text-muted-foreground text-xs">Today</div>
          <div className="text-2xl font-semibold">{today.length}</div>
          <div className="text-xs text-muted-foreground mt-1">events</div>
        </div>
        <div className="rounded-2xl border p-4 bg-card">
          <div className="text-muted-foreground text-xs">Top names (30m)</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {topLast30.length ? (
              topLast30.map(([n, c]) => (
                <span key={n} className="text-xs px-2 py-1 rounded bg-muted text-foreground/80">
                  {n} · {c}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
        </div>
      </section>

      <div className="mb-2 flex items-center gap-3">
        <input
          ref={inputRef}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Filter by name, session or payload…"
          className="w-full md:w-96 border rounded-xl px-3 py-2 text-sm bg-background"
        />
        <div className="text-xs text-muted-foreground">
          {lastRefresh ? `Updated ${timeAgo(lastRefresh.toISOString())}` : ""}
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">Time</th>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Session</th>
              <th className="text-left px-3 py-2">Payload</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t hover:bg-muted/40">
                <td className="px-3 py-2 whitespace-nowrap text-muted-foreground" title={new Date(r.created_at).toLocaleString()}>
                  {timeAgo(r.created_at)}
                </td>
                <td className="px-3 py-2 font-medium">{r.name}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.session_id?.slice(0, 8) ?? "—"}</td>
                <td className="px-3 py-2">
                  <details>
                    <summary className="cursor-pointer select-none text-muted-foreground">view</summary>
                    <pre className="mt-2 text-xs bg-background rounded p-2 overflow-x-auto">
{`$${"{"}}\n${JSON.stringify(r.payload, null, 2)}\n${"}"}`}
                    </pre>
                    <button
                      className="mt-2 text-xs underline"
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(r.payload, null, 2))}
                    >
                      copy JSON
                    </button>
                  </details>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-muted-foreground" colSpan={4}>
                  No events
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Scope is governed by RLS. Non-admins see their own events; admins can see all.
      </p>
    </main>
  );
}
