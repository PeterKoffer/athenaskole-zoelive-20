
export interface Position {
  x: number;
  y: number;
}

export interface DragState {
  isDragging: boolean;
  startPosition: Position;
  currentPosition: Position;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  showOptions?: boolean;
}
