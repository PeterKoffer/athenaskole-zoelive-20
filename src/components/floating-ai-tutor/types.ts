
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  showOptions?: boolean;
}

export interface FloatingTutorState {
  isOpen: boolean;
  messages: Message[];
  isDragging: boolean;
  position: { x: number; y: number };
}
