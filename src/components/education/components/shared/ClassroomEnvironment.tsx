
import { ReactNode } from 'react';

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
  return (
    <div 
      className={`min-h-screen w-full relative ${className}`}
      style={{
        backgroundImage: `url(${config.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Colored overlay for subject theming */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: config.subjectColor,
          opacity: config.overlayOpacity
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
