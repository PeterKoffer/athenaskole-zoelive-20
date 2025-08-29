import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const BUCKET = 'universe-images';
const MIN_BYTES = 1024;

function makePlaceholderBlob(
  label = 'Cover',
  mime: 'image/webp' | 'image/png' = 'image/webp'
): Promise<Blob> {
  const w = 1024, h = 512;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d')!;
  const grd = g.createLinearGradient(0,0,w,h);
  grd.addColorStop(0,'#1d4ed8'); grd.addColorStop(1,'#9333ea');
  g.fillStyle = grd; g.fillRect(0,0,w,h);
  g.fillStyle = 'rgba(255,255,255,.9)';
  g.font = 'bold 38px system-ui, sans-serif';
  g.fillText(label, 28, 64);
  return new Promise(res =>
    c.toBlob(
      b => res(b!),
      mime,
      mime === 'image/webp' ? 0.9 : undefined
    )!
  );
}

async function listAll(prefix = ''): Promise<string[]> {
  const out: string[] = [];
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000 });
  if (error) throw error;
  for (const item of data || []) {
    const isFile = !!item?.metadata && typeof item.metadata.size === 'number';
    if (isFile) out.push(prefix + item.name);
    else out.push(...await listAll(prefix + item.name + '/'));
  }
  return out;
}

export default function RepairCoversButton() {
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const append = (s: string) => setLog(x => [...x, s]);

  const run = async () => {
    setRunning(true);
    setLog([]);
    try {
      const all = await listAll('');
        const covers = all.filter(p => /\/6\/cover\.(webp|png)$/i.test(p));
      append(`Found ${covers.length} covers`);

      let repaired = 0;

      for (const path of covers) {
        // ensure (deletes corrupt if server-guard is activated)
        await supabase.functions.invoke('image-ensure', {
          body: { bucket: BUCKET, objectKey: path }
        });

        // HEAD check
        const { data: sign } = await supabase.storage.from(BUCKET).createSignedUrl(path, 300);
        if (!sign?.signedUrl) { append(`No URL for ${path}`); continue; }

        const head = await fetch(sign.signedUrl, { method: 'HEAD' });
        const len = parseInt(head.headers.get('content-length') || '0', 10);
        const type = head.headers.get('content-type') || '';

        if (!head.ok || !type.startsWith('image/') || len < MIN_BYTES) {
          const isPng = path.toLowerCase().endsWith('.png');
          const mime = isPng ? 'image/png' as const : 'image/webp' as const;
          const blob = await makePlaceholderBlob('Cover', mime);
          const { error } = await supabase.storage.from(BUCKET)
            .upload(path, blob, { upsert: true, contentType: mime });
          if (error) { append(`Upload failed ${path}: ${error.message}`); continue; }
          repaired++;
          append(`Repaired ${path}`);
        }
      }

      append(`Done. Repaired ${repaired}/${covers.length} covers`);
    } catch (e: any) {
      append(`Error: ${e?.message || e}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-4 rounded-xl border bg-slate-900 text-slate-100 space-y-3">
      <button
        disabled={running}
        onClick={run}
        className="px-4 py-2 rounded-lg bg-indigo-600 disabled:opacity-50"
      >
        {running ? 'Repairing…' : 'Repair all covers'}
      </button>
      <pre className="text-xs whitespace-pre-wrap max-h-64 overflow-auto">{log.join('\n')}</pre>
    </div>
  );
}