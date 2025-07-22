import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export interface ClassLessonDurations {
  [classId: string]: number; // minutes 1-600 (1-10 hours)
}

export function useClassLessonDurations() {
  const [durations, setDurations] = useState<ClassLessonDurations>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("classLessonDurations");
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch (err) {
          console.error("Failed to parse class lesson durations", err);
        }
      }
    }
    return {};
  });

  const saveDurations = (newDurations: ClassLessonDurations) => {
    setDurations(newDurations);
    if (typeof window !== "undefined") {
      localStorage.setItem("classLessonDurations", JSON.stringify(newDurations));
    }
    toast({
      title: "Durations Saved",
      description: "Class lesson durations saved successfully."
    });
  };

  return { durations, saveDurations };
}
