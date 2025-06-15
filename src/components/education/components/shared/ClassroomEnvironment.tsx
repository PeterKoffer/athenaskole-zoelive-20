import { ReactNode } from 'react';
import { useImageLoaded } from "./hooks/useImageLoaded";

export interface ClassroomConfig {
  backgroundImage: string;
  subjectColor: string;
  accentColor: string;
  overlayOpacity: number;
  subjectName: string;
  environmentDescription: string;
}

interface ClassroomEnvironmentProps {
  config: ClassroomConfig;
  children: ReactNode;
  className?: string;
}

const ClassroomEnvironment = ({ config, children, className = '' }: ClassroomEnvironmentProps) => {
  const imageLoaded = useImageLoaded(config.backgroundImage);

  return (
    <div
      className={`min-h-screen w-full relative ${className} transition-colors duration-300`}
      // Set the fallback subject color as base
      style={{
        backgroundColor: config.subjectColor,
        // Don't set bg image on root; handle with overlay below for fade transition
      }}
    >
      {/* Background image fade-in overlay */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-700 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
        style={{
          backgroundImage: `url(${config.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          // Prevent flash of white by no default bg!
        }}
      />
      {/* Colored overlay for subject theming (opacity usually 0) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundColor: config.subjectColor,
          opacity: config.overlayOpacity,
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>

      {/* Subtle gradient for readability */}
      <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
};

export default ClassroomEnvironment;
