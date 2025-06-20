
export interface Position {
  x: number;
  y: number;
}

export interface DragState {
  isDragging: boolean;
  startPosition: Position;
  currentPosition: Position;
}
