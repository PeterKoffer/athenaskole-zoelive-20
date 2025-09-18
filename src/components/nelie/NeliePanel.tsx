import { useState } from "react";
import { useAppKernel } from "@/state/appKernel";
import type { NelieContext } from "@/types/nelie";

export function NeliePanel({ adventureId, task }: { adventureId: string; task?: any }) {
  const { leader, teacher, student } = useAppKernel();
  const [mode, setMode] = useState<NelieContext["mode"]>("chat");
  const [messages, setMessages] = useState<{role:"user"|"nelie"; text:string}[]>([]);
  const [live, setLive] = useState(false);

  async function askNELIE(text: string) {
    const ctx: NelieContext = {
      student: student!, teacher: teacher!, leader: leader!,
      adventureId, task, mode, curriculumGoals: task?.progressTags
    };

    // 1) Prebagt hints for alt undtagen ren chat
    if (!live && mode !== "chat") {
      const gb = student?.gradeBand || "5";
      const taskId = task?.id || "default";
      try {
        const res = await fetch(`/demo/hints/${adventureId}/${taskId}/${gb}.json`);
        if (res.ok) {
          const hp = await res.json();
          const key = mode === "hint" ? "hint" : mode === "explain" ? `explain_like_${gb}` : mode === "example" ? "example" : "hint";
          const reply = Array.isArray(hp[key]) ? hp[key][0] : (hp[key] || "Let's break it down…");
          setMessages(m => [...m, { role:"user", text }, { role:"nelie", text: reply }]);
          return;
        }
      } catch {}
    }

    // 2) Live AI (Edge stub – implementér efter behov)
    try {
      const res = await fetch("/functions/v1/nelie-reply", { method:"POST", body: JSON.stringify({ text, ctx }) });
      const json = await res.json();
      setMessages(m => [...m, { role:"user", text }, { role:"nelie", text: json.reply ?? "..." }]);
    } catch {
      setMessages(m => [...m, { role:"user", text }, { role:"nelie", text: "NELIE er i offline-tilstand. Prøv prebagte hints eller prøv igen." }]);
    }
  }

  return (
    <aside className="w-full md:w-96 border-l bg-white flex flex-col">
      <header className="p-3 flex gap-2 items-center">
        <strong>NELIE</strong>
        <select className="ml-auto" value={mode} onChange={e=>setMode(e.target.value as any)}>
          <option value="chat">Chat</option><option value="hint">Hint</option>
          <option value="explain">Forklar</option><option value="example">Eksempel</option>
          <option value="check">Tjek svar</option><option value="quiz">Quiz mig</option>
        </select>
        <label className="text-sm flex items-center gap-1">
          <input type="checkbox" checked={live} onChange={e=>setLive(e.target.checked)} /> Live AI
        </label>
      </header>
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {messages.map((m,i)=>(
          <div key={i} className={m.role==="nelie"?"bg-gray-50 p-2 rounded":"p-2"}>{m.text}</div>
        ))}
      </div>
      <form className="p-3 flex gap-2" onSubmit={e=>{e.preventDefault(); const form = e.currentTarget as any; const v=form.q.value; if(!v) return; askNELIE(v); form.reset();}}>
        <input name="q" className="border rounded px-3 py-2 flex-1" placeholder="Spørg NELIE…" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
      </form>
    </aside>
  );
}