
export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Position {
  x: number;
  y: number;
}

export interface DragOffset {
  x: number;
  y: number;
}
