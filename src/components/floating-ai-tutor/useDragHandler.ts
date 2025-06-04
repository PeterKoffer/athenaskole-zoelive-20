
import { Position } from "./types";
import { usePositionManager } from "./usePositionManager";
import { useStorageManager } from "./useStorageManager";
import { useEventHandlers } from "./useEventHandlers";

export const useDragHandler = (homePosition: Position) => {
  const { position, updatePosition, resetToHome, animationFrameId } = usePositionManager(homePosition);
  
  useStorageManager(position);
  
  const { isDragging, handleMouseDown, handleTouchStart, hasMoved } = useEventHandlers({
    updatePosition,
    animationFrameId
  });

  return {
    position,
    isDragging,
    handleMouseDown,
    handleTouchStart,
    resetToHome,
    hasMoved
  };
};
