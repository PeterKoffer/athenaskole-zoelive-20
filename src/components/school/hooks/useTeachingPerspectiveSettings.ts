
import { useState } from "react";
import { TeachingPerspectiveSettings } from "@/types/school";
import { toast } from "@/hooks/use-toast";

const DEFAULT_SETTINGS: TeachingPerspectiveSettings = {
  perspective: "none",
  strength: 1,
  wishes: "",
  avoid: "",
  lastUpdated: undefined,
  subjectWeights: {},
};

/**
 * For now: simple client-side/in-memory state (no backend).
 */
export function useTeachingPerspectiveSettings() {
  const [settings, setSettings] = useState<TeachingPerspectiveSettings>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("schoolTeachingPerspectiveSettings");
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch (error) {
          console.error("Error parsing teaching perspective settings:", error);
          return DEFAULT_SETTINGS;
        }
      }
    }
    return DEFAULT_SETTINGS;
  });

  const saveSettings = (newSettings: TeachingPerspectiveSettings) => {
    try {
      const settingsWithTimestamp = {
        ...newSettings,
        lastUpdated: new Date().toISOString()
      };
      
      setSettings(settingsWithTimestamp);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("schoolTeachingPerspectiveSettings", JSON.stringify(settingsWithTimestamp));
      }
      
      toast({
        title: "Settings Saved",
        description: "Teaching perspective settings have been successfully saved.",
      });
      
      console.log("Teaching perspective settings saved:", settingsWithTimestamp);
    } catch (error) {
      console.error("Error saving teaching perspective settings:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { settings, saveSettings };
}
