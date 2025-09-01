import { describe, it, expect } from "vitest";
import { z } from "zod";

const ContentResponse = z.object({
  ok: z.literal(true),
  data: z.object({
    title: z.string(),
    outline: z.array(z.string()).default([]),
    activities: z.array(z.object({
      type: z.string(),
      durationMin: z.number(),
      instructions: z.string(),
    })).default([]),
  })
}).or(z.object({ ok: z.literal(false), error: z.string() }));

const URL = process.env.VITE_CONTENT_EDGE_URL;

describe("generate-content contract", () => {
  if (!URL) {
    it.skip("skipped (VITE_CONTENT_EDGE_URL mangler)", () => {});
    return;
  }
  it("returns valid content shape", async () => {
    const payload = { subject:"Mathematics", grade:"5a", curriculum:"DK-Common", interests:["football"] };
    const res = await fetch(URL, { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify(payload) });
    expect(res.ok).toBe(true);
    const json = await res.json();
    const parsed = ContentResponse.safeParse(json);
    expect(parsed.success).toBe(true);
  }, 20000);
});