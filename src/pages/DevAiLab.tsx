// src/pages/DevAiLab.tsx
import React, { useState } from "react";
import { aiText, aiImage } from "@/lib/ai";

export default function DevAiLab() {
  // text
  const [textPrompt, setTextPrompt] = useState("Give me a short math warmup for grade 4");
  const [textOut, setTextOut] = useState<string>("");

  // image
  const [imgPrompt, setImgPrompt] = useState("cartoon cat reading a book, simple cute vector");
  const [imgSize, setImgSize] = useState("1024x1024"); // OpenAI valid defaults
  const [imgSrc, setImgSrc] = useState<string>("");

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>("");

  async function runText() {
    try {
      setBusy(true); setErr("");
      const res = await aiText({ prompt: textPrompt, orgId: "demo-org" });
      setTextOut(res.output);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  async function runImage() {
    try {
      setBusy(true); setErr("");
      const res = await aiImage({ prompt: imgPrompt, size: imgSize });
      setImgSrc(res.src);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-8">
      <h1 className="text-2xl font-bold">AI Lab</h1>

      {err && <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{err}</div>}

      {/* TEXT */}
      <section className="rounded-2xl border p-4 space-y-3">
        <h2 className="font-semibold">Text (ai-text)</h2>
        <textarea
          className="w-full border rounded-md p-2 min-h-[100px]"
          value={textPrompt}
          onChange={(e) => setTextPrompt(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
          onClick={runText}
          disabled={busy}
        >
          Generate
        </button>
        {textOut && (
          <pre className="whitespace-pre-wrap text-sm bg-neutral-50 border rounded-md p-3">{textOut}</pre>
        )}
      </section>

      {/* IMAGE */}
      <section className="rounded-2xl border p-4 space-y-3">
        <h2 className="font-semibold">Image (ai-image)</h2>
        <textarea
          className="w-full border rounded-md p-2 min-h-[80px]"
          value={imgPrompt}
          onChange={(e) => setImgPrompt(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <label className="text-sm">Size</label>
          <select
            className="border rounded-md p-2"
            value={imgSize}
            onChange={(e) => setImgSize(e.target.value)}
          >
            <option>1024x1024</option>
            <option>1024x1536</option>
            <option>1536x1024</option>
            <option>auto</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
            onClick={runImage}
            disabled={busy}
          >
            Generate
          </button>
          <button
            className="px-4 py-2 rounded-md border disabled:opacity-50"
            onClick={async () => {
              setBusy(true); setErr("");
              try {
                const res = await aiImage({ prompt: imgPrompt, size: imgSize, mode: "cheap" });
                setImgSrc(res.src);
              } catch (e: any) {
                setErr(String(e?.message || e));
              } finally {
                setBusy(false);
              }
            }}
            disabled={busy}
            title="Free placeholder (no API cost)"
          >
            Cheap/Placeholder
          </button>
        </div>
        {imgSrc && (
          <img src={imgSrc} alt="generated" className="mt-3 rounded-xl border max-w-full" />
        )}
      </section>
    </div>
  );
}
