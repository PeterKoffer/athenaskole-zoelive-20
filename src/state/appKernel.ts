import { create } from "zustand";
import type { SchoolLeaderSettings, TeacherSettings, StudentProfile, Worldview } from "@/types/core";

type KernelState = {
  leader?: SchoolLeaderSettings;
  teacher?: TeacherSettings;
  student?: StudentProfile;
  resolved: {
    worldview: Worldview;
    faithLevel: 0|1|2|3;
    subjectWeights: Record<string, number>;
    language: string;
    curriculum: string;
    calendarKeywords: string[];
    constraints: string[];
  };
  hydrate: (p: {leader?:SchoolLeaderSettings;teacher?:TeacherSettings;student?:StudentProfile}) => void;
};

export const useAppKernel = create<KernelState>((set: any)=>({
  resolved: {
    worldview: "neutral",
    faithLevel: 0,
    subjectWeights: {},
    language: "en-US",
    curriculum: "US-CommonCore-2023",
    calendarKeywords: [],
    constraints: ["screen-only"]
  },
  hydrate: ({leader,teacher,student}: {leader?:SchoolLeaderSettings;teacher?:TeacherSettings;student?:StudentProfile})=>{
    const language = student?.preferredLanguage ?? "en-US";
    const curriculum = student?.curriculumOverride ?? leader?.curriculum ?? "US-CommonCore-2023";
    const subjectWeights = {...(leader?.subjectWeights||{}), ...(teacher?.subjectEmphasis||{})};
    const faithLevel = leader?.faithIntegrationLevel ?? 0;
    const worldview = leader?.worldview ?? "neutral";
    const calendarKeywords = teacher?.calendarKeywords ?? [];
    const constraints = teacher?.constraints ?? ["screen-only"];
    set({leader,teacher,student, resolved:{language,curriculum,subjectWeights,faithLevel,worldview,calendarKeywords,constraints}});
  }
}));