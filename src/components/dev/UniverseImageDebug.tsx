// Debug component to diagnose universe image issues
interface Universe {
  id?: string;
  slug?: string;
  name?: string;
  subject?: string;
}

interface UniverseImageDebugProps {
  universe?: Universe;
}

export function UniverseImageDebug({ universe }: UniverseImageDebugProps) {
  const key = universe?.id ?? universe?.slug;
  const storageUrl = key
    ? `https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images/${key}.png`
    : "(no key)";
    
  return (
    <div className="text-xs p-2 bg-zinc-900/60 rounded font-mono">
      <div>key: <b>{String(key)}</b></div>
      <div>storage: <a href={storageUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{storageUrl}</a></div>
      <div>origin: {typeof window !== "undefined" ? window.location.origin : "(ssr)"}</div>
      <div>universe.id: {universe?.id}</div>
      <div>universe.slug: {universe?.slug}</div>
      <div>universe.subject: {universe?.subject}</div>
    </div>
  );
}