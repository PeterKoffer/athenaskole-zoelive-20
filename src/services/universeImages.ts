import { supabase } from '@/integrations/supabase/client';
import { invokeFn } from '@/supabase/functionsClient';

export const MIN_BYTES = 1024;
const repairing = new Map<string, Promise<string>>();
const REPAIR_TTL_MS = 10 * 60 * 1000;
import type { ImageEnsureReq, ImageEnsureRes } from '@/types/api';

const normalizePath = (path: string) => path.replace(/^\/+/, '').replace(/\/{2,}/g, '/');

function recentlyRepaired(path: string) {
  const k = `img_fix:${path}`;
  const t = Number(localStorage.getItem(k) || 0);
  if (Date.now() - t < REPAIR_TTL_MS) return true;
  localStorage.setItem(k, String(Date.now()));
  return false;
}

async function makePlaceholderBlob(label = "Cover"): Promise<Blob> {
  const w = 1024, h = 512;
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d")!;
  const grd = g.createLinearGradient(0,0,w,h);
  grd.addColorStop(0,"#1d4ed8"); grd.addColorStop(1,"#9333ea");
  g.fillStyle = grd; g.fillRect(0,0,w,h);
  g.fillStyle = "rgba(255,255,255,.92)";
  g.font = "700 44px system-ui,sans-serif";
  g.fillText(label, 28, 64);
  return await new Promise(r => c.toBlob(b => r(b!), "image/webp", 0.9)!);
}

type EnsureResult = { ok: boolean; path: string; exists?: boolean; created?: boolean; placeholder?: boolean };

export async function ensureAndSign(path: string, expires = 300): Promise<string> {
  const ensure = await invokeFn<EnsureResult>('image-ensure', {
    bucket: 'universe-images',
    path,
    generateIfMissing: true,
  });
  if (!ensure?.ok) throw new Error('image-ensure failed');

  const { data, error } = await supabase.storage
    .from('universe-images')
    .createSignedUrl(path, expires);

  if (error || !data?.signedUrl) throw error ?? new Error('sign failed');
  return data.signedUrl;
}

export async function headOk(url: string, minBytes = MIN_BYTES) {
  const res = await fetch(url, { method: 'HEAD' });
  const len = parseInt(res.headers.get('content-length') || '0', 10);
  const type = res.headers.get('content-type') || '';
  return { ok: res.ok && type.startsWith('image/') && len >= minBytes, status: res.status, type, len };
}

/** Lille, pæn inline-placeholder så vi altid viser noget */
export function inlinePlaceholder(width = 512, height = 256, label = 'Loading…') {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#1d4ed8' offset='0'/>` +
    `<stop stop-color='#9333ea' offset='1'/></linearGradient></defs>` +
    `<rect width='100%' height='100%' fill='url(#g)'/>` +
    `<text x='24' y='48' fill='rgba(255,255,255,.85)' font-family='system-ui,sans-serif' font-size='28' font-weight='700'>${label}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export async function getUniverseImageSignedUrl(path: string, opts?: { autoHeal?: boolean; label?: string; ttlSec?: number }): Promise<string> {
  const { autoHeal = import.meta.env.VITE_IMG_AUTOHEAL !== "false", label = "Cover", ttlSec = 300 } = opts || {};
  
  // 1) ensure (edge) + sign (storage)
  const url = await ensureAndSign(path, ttlSec);

  // 2) sanity HEAD
  const head = await fetch(url, { method: "HEAD" });
  const len = Number(head.headers.get("content-length") || 0);
  const type = (head.headers.get("content-type") || "").toLowerCase();
  const looksBad = !head.ok || !type.startsWith("image/") || len < MIN_BYTES;

  if (!looksBad || !autoHeal) return url;

  // 3) mutex + throttle
  if (recentlyRepaired(path)) return url;
  if (!repairing.has(path)) {
    repairing.set(path, (async () => {
      console.log(`🔧 Auto-healing corrupt image: ${path} (${len} bytes)`);
      
      // 4) create placeholder and upload (upsert)
      const blob = await makePlaceholderBlob(label);
      const { error } = await supabase.storage.from("universe-images").upload(path, blob, {
        upsert: true, 
        contentType: "image/webp",
      });
      
      if (error) {
        console.error(`Failed to auto-heal ${path}:`, error);
        throw error;
      }

      // 5) re-ensure + re-sign + cache-buster
      const fresh = await ensureAndSign(path, ttlSec);
      console.log(`✅ Auto-healed: ${path}`);
      return `${fresh}&v=${Date.now()}`;
    })().finally(() => repairing.delete(path)));
  }
  return repairing.get(path)!;
}

export async function getUniverseCoverSignedUrl(universeId: string, version = 6): Promise<string> {
  return getUniverseImageSignedUrl(`${universeId}/${version}/cover.webp`, { label: 'Cover' });
}