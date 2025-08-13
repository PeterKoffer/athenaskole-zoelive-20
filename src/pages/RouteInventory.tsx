import { useEffect, useMemo, useState } from "react";

// 1) Grab file contents for everything in /src/pages and App.tsx
// Vite supports import.meta.glob with as:"raw" to read file text.
const pageFiles = import.meta.glob("/src/pages/**/*.{tsx,jsx}", { as: "raw" });
const appFiles  = import.meta.glob("/src/{App,main,router,routes}.{tsx,jsx}", { as: "raw" });

// Simple route path regexes (React Router v6-ish)
const RX_ROUTE   = /<Route\s+[^>]*path=["']([^"']+)["']/g;
const RX_INDEX   = /<Route\s+[^>]*index\s*=?\s*{?true}?/g;
const RX_META    = /export\s+const\s+routeMeta\s*=\s*{[^}]*path\s*:\s*["']([^"']+)["'][^}]*}/g;

// Heuristic page title
const RX_TITLE   = /export\s+const\s+PageTitle\s*=\s*["'`]([^"'`]+)["'`]/;

type RouteRow = {
  kind: "route"|"index";
  path: string;
  file: string;     // where we found it
  source: "App"|"Page";
};

type PageRow = {
  file: string;
  title?: string;
  guessRoute?: string;
  category: string;  // folder hint
};

export default function RouteInventory() {
  const [routes, setRoutes] = useState<RouteRow[]>([]);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const found: RouteRow[] = [];

      // scan App/router files for <Route path="...">
      for (const [file, loader] of Object.entries(appFiles)) {
        const text = await (loader as any)();
        let m: RegExpExecArray | null;

        while ((m = RX_ROUTE.exec(text))) {
          found.push({ kind: "route", path: m[1], file, source: "App" });
        }
        while (RX_INDEX.exec(text)) {
          found.push({ kind: "index", path: "(index)", file, source: "App" });
        }
        while ((m = RX_META.exec(text))) {
          found.push({ kind: "route", path: m[1], file, source: "App" });
        }
      }

      // scan page files for routeMeta or hint titles
      const pageRows: PageRow[] = [];
      for (const [file, loader] of Object.entries(pageFiles)) {
        const text = await (loader as any)();
        const title = RX_TITLE.test(text) ? (text.match(RX_TITLE)![1]) : undefined;

        // try to find a routeMeta in the page itself (optional discipline)
        const meta = RX_META.exec(text);
        const guessRoute = meta ? meta[1] : undefined;

        // category = immediate folder under /pages
        const rel = file.replace(/^\/src\/pages\//, "");
        const parts = rel.split("/");
        const category = parts.length > 1 ? parts[0] : "(root)";

        pageRows.push({ file: rel, title, guessRoute, category });

        // Also treat page-defined routeMeta as a route hint
        if (guessRoute) {
          found.push({ kind: "route", path: guessRoute, file, source: "Page" });
        }

        // reset regex state for next loop
        RX_META.lastIndex = 0;
        RX_TITLE.lastIndex = 0;
      }

      // De-dupe and sort a bit
      const seen = new Set<string>();
      const dedup = found.filter(r => {
        const key = `${r.source}:${r.file}:${r.path}:${r.kind}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).sort((a,b) => a.path.localeCompare(b.path));

      setRoutes(dedup);
      setPages(pageRows.sort((a,b) => a.file.localeCompare(b.file)));
    })();
  }, []);

  const filteredRoutes = useMemo(() => {
    if (!q.trim()) return routes;
    const t = q.toLowerCase();
    return routes.filter(r => r.path.toLowerCase().includes(t) || r.file.toLowerCase().includes(t));
  }, [routes, q]);

  const filteredPages = useMemo(() => {
    if (!q.trim()) return pages;
    const t = q.toLowerCase();
    return pages.filter(p =>
      p.file.toLowerCase().includes(t) ||
      (p.title?.toLowerCase().includes(t) ?? false) ||
      (p.guessRoute?.toLowerCase().includes(t) ?? false)
    );
  }, [pages, q]);

  // Group pages by category to spot duplication (e.g., /pages/Math/, /pages/Mathematics/)
  const grouped = useMemo(() => {
    const g: Record<string, PageRow[]> = {};
    for (const p of filteredPages) (g[p.category] ??= []).push(p);
    return g;
  }, [filteredPages]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Route & Page Inventory</h1>

      <div className="flex gap-2 items-center">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Filter by path, file, or title…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <span className="text-sm opacity-70">{filteredRoutes.length} routes • {filteredPages.length} pages</span>
      </div>

      <section>
        <h2 className="font-semibold mb-2">Detected Routes</h2>
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-100">
              <tr>
                <th className="text-left p-2">Path</th>
                <th className="text-left p-2">Kind</th>
                <th className="text-left p-2">Source</th>
                <th className="text-left p-2">File</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 font-mono">{r.path}</td>
                  <td className="p-2">{r.kind}</td>
                  <td className="p-2">{r.source}</td>
                  <td className="p-2 font-mono">{r.file.replace(/^\/src\//, "")}</td>
                </tr>
              ))}
              {filteredRoutes.length === 0 && (
                <tr><td colSpan={4} className="p-4 opacity-70">No routes matched.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Pages by Category (folder under /pages)</h2>
        <div className="space-y-4">
          {Object.entries(grouped).sort().map(([cat, items]) => (
            <div key={cat} className="border rounded">
              <div className="px-3 py-2 bg-neutral-50 flex items-center justify-between">
                <div className="font-mono">{cat}</div>
                <div className="text-xs opacity-70">{items.length} files</div>
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="p-2">File</th>
                      <th className="p-2">Title (optional)</th>
                      <th className="p-2">Guess route (routeMeta)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(p => (
                      <tr key={p.file} className="border-t">
                        <td className="p-2 font-mono">{p.file}</td>
                        <td className="p-2">{p.title ?? <span className="opacity-50">—</span>}</td>
                        <td className="p-2 font-mono">{p.guessRoute ?? <span className="opacity-50">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          {Object.keys(grouped).length === 0 && (
            <div className="p-4 opacity-70">No pages matched.</div>
          )}
        </div>
      </section>

      <p className="text-xs opacity-70">
        Tip: Add <code>export const routeMeta = &#123; path: "/my/path" &#125;</code> and/or <code>export const PageTitle = "Nice title"</code> to any page
        so this inventory can show friendlier data while you migrate to a central route config.
      </p>
    </div>
  );
}