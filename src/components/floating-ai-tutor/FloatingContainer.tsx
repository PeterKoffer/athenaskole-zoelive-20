
import { ReactNode } from "react";

interface FloatingContainerProps {
  children: ReactNode;
  position: { x: number; y: number };
}

const FloatingContainer = ({ children, position }: FloatingContainerProps) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: 9999999,
        pointerEvents: 'auto',
        transform: 'translateZ(0)',
      }}
      className="floating-tutor-container"
    >
      {children}
    </div>
  );
};

export default FloatingContainer;
