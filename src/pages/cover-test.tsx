import { useEffect, useState } from "react";
import { ensureDailyProgramCover } from "@/services/UniverseImageGenerator";

export default function Page() {
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    ensureDailyProgramCover({
      universeId: "7150d0ee-59cc-40d9-a1f3-b31951bb5b24",
      title: "Today’s Program",
      subject: "general",
      grade: 5,
    }).then(setUrl);
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <h1>Cover Test</h1>
      {url ? <img src={url} alt="cover" width={1024} height={576} /> : <div>Loading…</div>}
    </div>
  );
}
