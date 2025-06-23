
import { ReactNode, useEffect } from 'react';
import { useOptimizedImageLoaded } from "./hooks/useOptimizedImageLoaded";
import { useClassroomImagePreloader } from "./hooks/useImagePreloader";

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
  const imageLoaded = useOptimizedImageLoaded(config.backgroundImage);

  // Preload all classroom images for faster navigation
  const { allImagesLoaded } = useClassroomImagePreloader();

  // Add high priority loading hint for current image
  useEffect(() => {
    if (config.backgroundImage) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = config.backgroundImage;
      link.fetchPriority = 'high';
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [config.backgroundImage]);

  return (
    <div
      className={`min-h-screen w-full relative ${className} transition-colors duration-300`}
      style={{
        backgroundColor: config.subjectColor,
      }}
    >
      {/* Background image with optimized loading */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
        style={{
          backgroundImage: `url(${config.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          willChange: 'opacity', // Optimize for opacity transitions
        }}
      />

      {/* Colored overlay for subject theming */}
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
