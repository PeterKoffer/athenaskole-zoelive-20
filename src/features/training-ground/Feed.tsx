import { useEffect, useState } from "react";
import { TrainingItem } from "@/types/core";

export default function TrainingFeed({ subject }: { subject: string }) {
  const [items, setItems] = useState<TrainingItem[]>([]);
  useEffect(()=> {
    (async ()=>{
      try {
        const res = await fetch("/functions/v1/generate-training", { method:"POST", body: JSON.stringify({ subject, n: 12 })});
        const json = await res.json();
        setItems(json.items || []);
      } catch { setItems([]); }
    })();
  }, [subject]);

  return (
    <div className="h-[calc(100dvh)] overflow-y-scroll snap-y snap-mandatory">
      {items.map(i=>(
        <section key={i.id} className="h-[100dvh] snap-start flex items-center justify-center p-6">
          <article className="w-full max-w-3xl space-y-4">
            <h2 className="text-2xl font-semibold">{i.subject.toUpperCase()} · {i.kind}</h2>
            <p className="text-lg">{i.promptText}</p>
            {i.media?.image && <img src={i.media.image} alt="" className="rounded-lg w-full" />}
          </article>
        </section>
      ))}
    </div>
  );
}