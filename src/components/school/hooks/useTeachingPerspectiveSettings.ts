
import { useState } from "react";
import { TeachingPerspectiveSettings, TeachingPerspectiveType } from "@/types/school";

const DEFAULT_SETTINGS: TeachingPerspectiveSettings = {
  perspective: "none",
  strength: 1,
  wishes: "",
  avoid: "",
  lastUpdated: undefined,
};

/**
 * For now: simple client-side/in-memory state (no backend).
 */
export function useTeachingPerspectiveSettings() {
  const [settings, setSettings] = useState<TeachingPerspectiveSettings>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("schoolTeachingPerspectiveSettings");
      if (raw) return JSON.parse(raw);
    }
    return DEFAULT_SETTINGS;
  });

  const saveSettings = (newSettings: TeachingPerspectiveSettings) => {
    setSettings(newSettings);
    if (typeof window !== "undefined") {
      localStorage.setItem("schoolTeachingPerspectiveSettings", JSON.stringify({ ...newSettings, lastUpdated: new Date().toISOString() }));
    }
  };

  return { settings, saveSettings };
}
