
export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  showOptions?: boolean;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  color: string;
}

export interface LearningOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}
