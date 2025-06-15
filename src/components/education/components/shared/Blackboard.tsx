
import { ReactNode } from 'react';

interface BlackboardProps {
  children: ReactNode;
  className?: string;
}

const Blackboard = ({ children, className = '' }: BlackboardProps) => {
  return (
    <div
      className={`board-intro relative bg-black/90 border-[3px] border-[#8B4513] shadow-2xl rounded-lg p-6 backdrop-blur-md mx-auto ${className}`}
      style={{
        maxWidth: 760,
        boxShadow: "0 6px 36px 6px rgba(20,22,24,0.45)",
        borderRadius: 16,
        borderColor: "#8B4513",
        borderWidth: 3,
        backgroundColor: "rgba(30, 32, 36, 0.92)",
      }}
    >
      {/* Chalk Doodles */}
      <div className="absolute top-5 left-5 text-white/20 text-4xl font-['cursive'] transform -rotate-12 select-none" aria-hidden="true">≈</div>
      <div className="absolute bottom-4 right-24 text-white/20 text-2xl font-['cursive'] transform rotate-6 select-none" aria-hidden="true">✓</div>
      <div className="absolute top-16 right-8 text-white/20 text-3xl font-['cursive'] transform rotate-12 select-none" aria-hidden="true">⨁</div>
      <div className="absolute bottom-16 left-8 text-white/20 text-2xl font-['cursive'] transform -rotate-6 select-none" aria-hidden="true">⎎</div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Blackboard;
