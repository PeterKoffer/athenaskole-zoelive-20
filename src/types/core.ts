export type Role = "student" | "teacher" | "parent" | "school" | "leader" | "admin";
export type GradeBand = "K"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"10"|"11"|"12" | "HS-1"|"HS-2"|"HS-3";

export type SubjectKey =
  | "nativeLanguage" | "mathematics" | "languageLab" | "science" | "historyReligion"
  | "geography" | "computerTech" | "creativeArts" | "musicDiscovery"
  | "physicalEd" | "mentalWellness" | "lifeEssentials";

export type LearningStyle = "visual"|"auditory"|"kinesthetic"|"readingWriting";
export type Worldview = "neutral"|"christian";

export interface SubjectWeights { 
  nativeLanguage?: number;
  mathematics?: number;
  languageLab?: number;
  science?: number;
  historyReligion?: number;
  geography?: number;
  computerTech?: number;
  creativeArts?: number;
  musicDiscovery?: number;
  physicalEd?: number;
  mentalWellness?: number;
  lifeEssentials?: number;
}

export interface SchoolLeaderSettings {
  country: string;
  curriculum: string;
  worldview: Worldview;
  faithIntegrationLevel: 0|1|2|3;
  subjectWeights: SubjectWeights;
  policy: {
    allowPrayerContent: boolean;
    allowScriptureCitations: boolean;
    creationCareFocus: boolean;
    serviceLearningFocus: boolean;
    publicDemoSafeMode: boolean;
  };
}

export interface TeacherSettings {
  classId?: string;
  dayLessonMinutes: number;
  subjectEmphasis: SubjectWeights;
  classroomValues: string[];
  constraints?: string[];
  calendarKeywords?: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  gradeBand: GradeBand;
  ability: "emerging"|"onLevel"|"advanced";
  learningStyle: LearningStyle;
  interests: string[];
  preferredLanguage: string;
  curriculumOverride?: string;
}

export interface CalendarContext {
  dateISO?: string;
  theme?: string;
  dayDurationMinutes?: number;
}

export interface LessonTask {
  subject: SubjectKey;
  title: string;
  body: string;
  checks?: string[];
  estMinutes?: number;
  id?: string;          // valgfri, nyttig til hints
  progressTags?: string[];
}

export interface DailyProgramPayload {
  adventureId: string;
  title: string;
  intro: string;
  images: { cover: string; scenes: string[] };
  tasks: LessonTask[];
  assessmentHints?: string[];
  faithBlock?: { prayer?: string; scripture?: string } | null;
  progressTags?: string[];
  simulator?: { kernel: string; stateSeed: any } | null;
  totalMinutes: number;
  targetMinutes: number;
  timePlan: Array<{ subject: SubjectKey; minutes: number }>;
}

export interface TrainingItem {
  id: string;
  subject: SubjectKey;
  kind: "micro-lesson"|"quiz"|"drill"|"video"|"scenario";
  promptText: string;
  media?: { image?: string; video?: string };
  estMinutes?: number;
  checks?: string[];
}