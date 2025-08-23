import { useEffect, useState } from "react";
import Image from "next/image";
import { ensureDailyProgramCover } from "@/services/UniverseImageGenerator";

export default function Page() {
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    ensureDailyProgramCover({
      universeId: "7150d0ee-59cc-40d9-a1f3-b31951bb5b24",
      gradeRaw: "5a",
      prompt: "Classroom-friendly landscape cover for Today’s Program",
    }).then(setUrl);
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <h1>Cover Test</h1>
      {url ? <Image src={url} alt="cover" width={1024} height={576} /> : <div>Loading…</div>}
    </div>
  );
}
