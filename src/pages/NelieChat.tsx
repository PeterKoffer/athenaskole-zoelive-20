import React, { useEffect, useMemo, useRef, useState } from "react";
import { aiText } from "@/lib/ai";

/** NELIE — Floating Tutor (with avatar) */

type Role = "user" | "nelie";
type ChatMessage = { id: string; role: Role; content: string; ts: number };

const SUBJECTS = [
  "Native language",
  "Mathematics",
  "Language lab",
  "Science",
  "History & Religion",
  "Geography",
  "Computer and technology",
  "Creative arts",
  "Music discovery",
  "Physical education",
  "Mental Wellness",
  "Life Essentials",
];

const GRADES = ["K","1","2","3","4","5","6","7","8","9","10","11","12"];

const LS_KEY = "nelie_chat_v1";

// Avatar kilde: miljøvariabel eller /public fallback
const NELIE_AVATAR =
  (import.meta as any)?.env?.VITE_NELIE_AVATAR_URL || "/nelie.png";

function Avatar({
  src,
  alt,
  size = 40,
}: {
  src: string;
  alt: string;
  size?: number;
}) {
  const s = { width: size, height: size };
  return (
    <img
      src={src}
      alt={alt}
      style={s}
      className="rounded-full object-cover border border-neutral-200 bg-white"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}

export default function NelieChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
    } catch {
      return [];
    }
  });
  const [subject, setSubject] = useState("Mathematics");
  const [grade, setGrade] = useState("4");
  const [cheapMode, setCheapMode] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(messages));
    requestAnimationFrame(() => {
      scrollerRef.current?.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages]);

  const systemHeader = useMemo(() => {
    return [
      `You are NELIE, a warm, curious, encouraging K-12 tutor.`,
      `Communicate clearly and simply for grade ${grade}.`,
      `Subject focus: ${subject}.`,
      `Teaching style:`,
      `- One idea at a time; short paragraphs; bullet points where helpful.`,
      `- Ask ONE check-for-understanding question before moving on.`,
      `- Encourage growth mindset and celebrate progress.`,
      `Safety: If the student asks for anything unsafe, gently refuse and redirect.`,
    ].join("\n");
  }, [grade, subject]);

  function buildPrompt(history: ChatMessage[]): string {
    const formatted = history
      .slice(-12)
      .map((m) => (m.role === "user" ? `Student: ${m.content}` : `NELIE: ${m.content}`))
      .join("\n");

    return [
      systemHeader,
      "",
      "Conversation so far:",
      formatted || "(no prior messages)",
      "",
      "Task: Continue the conversation as NELIE. Respond ONLY to the student's latest message. Keep it concise and kind.",
    ].join("\n");
  }

  async function send() {
    if (!input.trim() || busy) return;
    setError("");

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      ts: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    try {
      setBusy(true);
      const prompt = buildPrompt([...messages, userMsg]);
      const res = await aiText({
        prompt,
        orgId: "demo-org",
        mode: cheapMode ? "cheap" : "normal",
      });

      const text = (res.output || "").trim() || "(No reply received)";
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "nelie",
        content: text,
        ts: Date.now(),
      };
      setMessages((m) => [...m, botMsg]);
    } catch (e: any) {
      setError(e?.message || "NELIE failed to respond.");
    } finally {
      setBusy(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setError("");
  }

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      {/* Header med NELIE avatar */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar src={NELIE_AVATAR} alt="NELIE the floating tutor" size={44} />
          <div>
            <h1 className="text-2xl font-bold leading-tight">NELIE — Floating Tutor</h1>
            <div className="text-xs text-neutral-500">
              Subject:&nbsp;
              <strong>{subject}</strong> · Grade:&nbsp;
              <strong>{grade}</strong>
              {cheapMode ? " · Cheap mode" : ""}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="border rounded-md p-2 text-sm"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            aria-label="Subject"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            className="border rounded-md p-2 text-sm"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            aria-label="Grade"
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <label className="inline-flex items-center gap-2 text-sm px-2 py-1 border rounded-md">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={cheapMode}
              onChange={(e) => setCheapMode(e.target.checked)}
            />
            Cheap
          </label>

          <button
            className="px-3 py-2 rounded-md border text-sm"
            onClick={clearChat}
            disabled={busy}
            title="Clear conversation"
          >
            New chat
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Chat feed */}
      <div
        ref={scrollerRef}
        className="h-[60vh] overflow-y-auto rounded-2xl border p-4 bg-white"
      >
        {messages.length === 0 && (
          <div className="text-sm text-neutral-500">
            Say hi to NELIE! For example: “Help me practice fractions” or “Explain photosynthesis for my level.”
          </div>
        )}

        <div className="flex flex-col gap-3">
          {messages.map((m) =>
            m.role === "nelie" ? (
              <div key={m.id} className="flex items-start gap-3 max-w-[90%]">
                <Avatar src={NELIE_AVATAR} alt="NELIE" size={36} />
                <div
                  className="rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap bg-neutral-100"
                  title={new Date(m.ts).toLocaleString()}
                >
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex justify-end">
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap bg-black text-white"
                  title={new Date(m.ts).toLocaleString()}
                >
                  {m.content}
                </div>
              </div>
            )
          )}
          {busy && (
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Avatar src={NELIE_AVATAR} alt="NELIE" size={20} />
              NELIE is thinking…
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <form
        className="flex gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          className="flex-1 border rounded-md p-3"
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
          aria-label="Message"
        />
        <button
          className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
          disabled={busy || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
