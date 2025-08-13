// src/services/settings.ts
import { supabase } from "@/integrations/supabase/client";

type Scope = "system" | "school" | "class" | "teacher" | "student";

export type SettingKey =
  | "school.educational_direction"
  | "school.curriculum_country"
  | "class.timezone"
  | "teacher.lesson_duration_hours"
  | "teacher.subject_weights"
  | "teacher.teaching_perspective"
  | "teacher.learning_style"
  | "student.interest_profile"; // extend freely

export type SettingRow = {
  id: string;
  scope: Scope;
  org_id: string | null;
  class_id: string | null;
  user_id: string | null;
  key: string;
  value: any;
  version: number;
  updated_by: string;
  updated_at: string;
};

export type Context = {
  orgId?: string | null;
  classId?: string | null;
  userId?: string | null;
  roles?: string[]; // ["teacher","school_leader"] etc.
};

// ----- simple in-memory + local cache -----
const mem: Record<string, any> = {};
const LSK = (ctx: Context) =>
  `nelie:settings:${ctx.orgId ?? "org0"}:${ctx.classId ?? "class0"}:${ctx.userId ?? "user0"}`;

function loadLocal(ctx: Context) {
  try { return JSON.parse(localStorage.getItem(LSK(ctx)) || "{}"); } catch { return {}; }
}
function saveLocal(ctx: Context, data: any) {
  localStorage.setItem(LSK(ctx), JSON.stringify(data));
}

// ----- precedence (lowest -> highest) -----
const ORDER: Scope[] = ["system", "school", "class", "teacher", "student"];

// Merge by precedence: teacher wins
export function resolveEffective<T = any>(key: SettingKey, _ctx: Context, bag: Record<string, SettingRow[]>): T | undefined {
  let out: any = undefined;
  for (const scope of ORDER) {
    const rows = bag[scope] || [];
    const match = rows.find(r => r.key === key);
    if (match) out = { ...(out ?? {}), ...(match.value ?? {}) };
  }
  return out as T;
}

// Fetch all relevant scopes in parallel, cache, and return bag
export async function hydrateSettings(ctx: Context) {
  const queries = [
    (supabase as any).from("settings").select("*").eq("scope", "system"),
    ctx.orgId ? (supabase as any).from("settings").select("*").eq("scope","school").eq("org_id", ctx.orgId) : null,
    ctx.classId ? (supabase as any).from("settings").select("*").eq("scope","class").eq("org_id", ctx.orgId!).eq("class_id", ctx.classId) : null,
    ctx.userId ? (supabase as any).from("settings").select("*").eq("scope","teacher").eq("user_id", ctx.userId) : null,
    ctx.userId ? (supabase as any).from("settings").select("*").eq("scope","student").eq("user_id", ctx.userId) : null,
  ].filter(Boolean) as any[];

  const { data, error } = await Promise.all(queries).then(results => {
    const all: SettingRow[] = [];
    for (const r of results) {
      if (r.error) return { data: null, error: r.error };
      all.push(...(r.data as SettingRow[]));
    }
    return { data: all, error: null };
  });

  if (error) throw error;

  const bag: Record<string, SettingRow[]> = {
    system: [], school: [], class: [], teacher: [], student: []
  };
  for (const row of data!) {
    (bag[row.scope] ??= []).push(row);
  }

  mem[LSK(ctx)] = bag;
  saveLocal(ctx, bag);
  return bag;
}

// Read-through with local/mem fallback
export async function getEffective<T = any>(key: SettingKey, ctx: Context, opts?: { fallback?: T }) {
  const cached = mem[LSK(ctx)] ?? loadLocal(ctx);
  if (cached && Object.keys(cached).length) {
    return resolveEffective<T>(key, ctx, cached) ?? opts?.fallback;
  }
  const fresh = await hydrateSettings(ctx);
  return resolveEffective<T>(key, ctx, fresh) ?? opts?.fallback;
}

// Upsert any scope (RLS enforces who can write)
export async function setSetting(params: {
  scope: Scope;
  key: SettingKey;
  value: any;
  ctx: Context;
}) {
  const { scope, key, value, ctx } = params;
  const { data, error } = await (supabase as any).rpc("upsert_setting", {
    p_scope: scope,
    p_org_id: scope !== "system" ? ctx.orgId : null,
    p_class_id: scope === "class" ? ctx.classId : null,
    p_user_id: (scope === "teacher" || scope === "student") ? ctx.userId : null,
    p_key: key,
    p_value: value
  });
  if (error) throw error;

  // Optimistic cache update
  const bag = mem[LSK(ctx)] ?? loadLocal(ctx) ?? { system:[], school:[], class:[], teacher:[], student:[] };
  const list = bag[scope] ?? [];
  const idx = list.findIndex((r: SettingRow) =>
    r.key === key &&
    (r.org_id ?? "") === (ctx.orgId ?? "") &&
    (r.class_id ?? "") === (ctx.classId ?? "") &&
    (r.user_id ?? "") === (ctx.userId ?? "")
  );
  if (idx >= 0) list[idx] = data as unknown as SettingRow;
  else list.push(data as unknown as SettingRow);
  bag[scope] = list;
  mem[LSK(ctx)] = bag;
  saveLocal(ctx, bag);

  return data as unknown as SettingRow;
}