// Purge tiny/corrupt storage files (e.g., 4 bytes "null").
// Run manually or in CI. Only deletes files < MIN_BYTES and older than GRACE_MIN.
import { createClient } from "@supabase/supabase-js";

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  PURGE_BUCKET = "universe-images",
  PURGE_PREFIX = "",                          // e.g., "6" if you want to scope per grade
  MIN_BYTES = "1024",                         // 1KB threshold
  GRACE_MIN = "10",                           // only files older than X min
  DRY_RUN = "false",
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Helper: create full path from prefix + filename
const join = (p: string, n: string) => (p ? `${p}/${n}` : n);

async function listAll(prefix: string) {
  const out: any[] = [];
  let page = 0;
  while (true) {
    const { data, error } = await supabase.storage
      .from(PURGE_BUCKET)
      .list(prefix, { limit: 1000, offset: page * 1000 });
    if (error) throw error;
    if (!data?.length) break;
    out.push(...data);
    page++;
  }
  return out;
}

async function run() {
  const minBytes = parseInt(MIN_BYTES, 10);
  const graceMs = parseInt(GRACE_MIN, 10) * 60_000;
  const cutoff = Date.now() - graceMs;
  let removed = 0;

  console.log(`🔍 Scanning bucket: ${PURGE_BUCKET}${PURGE_PREFIX ? `/${PURGE_PREFIX}` : ''}`);
  console.log(`📏 Threshold: < ${minBytes} bytes, older than ${GRACE_MIN} min`);

  const entries = await listAll(PURGE_PREFIX);
  const victims = entries.filter((f) => {
    if (!("size" in f) || typeof f.size !== "number") return false;
    const updatedAt = (f.updated_at ? new Date(f.updated_at) : new Date()).getTime();
    return f.size < minBytes && updatedAt < cutoff && !f.id?.endsWith("/");
  });

  const paths = victims.map((f) => join(PURGE_PREFIX, f.name));
  if (!paths.length) {
    console.log("✅ No tiny files found.");
    return;
  }

  if (DRY_RUN === "true") {
    console.log("🔎 DRY RUN — would remove:", paths.length, "files");
    console.log("Sample paths:", paths.slice(0, 10));
    return;
  }

  // Supabase allows batch remove in one call (max 1000)
  const { error } = await supabase.storage.from(PURGE_BUCKET).remove(paths);
  if (error) throw error;

  removed += paths.length;
  console.log(`🧹 Removed ${removed} tiny files`);
}

run().catch((e) => {
  console.error("Purge failed:", e);
  process.exit(1);
});