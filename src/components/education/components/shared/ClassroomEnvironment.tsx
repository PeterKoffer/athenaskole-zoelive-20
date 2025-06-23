
import React from 'react';

export interface ClassroomConfig {
  subjectName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  loadingIcon?: string;
  loadingMessage?: string;
  backgroundImage: string;
  subjectColor: string;
  overlayOpacity: number;
  environmentDescription: string; // Required field
}

interface ClassroomEnvironmentProps {
  config: ClassroomConfig;
  children: React.ReactNode;
}

const ClassroomEnvironment: React.FC<ClassroomEnvironmentProps> = ({ config, children }) => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ 
        backgroundImage: `url(${config.backgroundImage})`,
      }}
    >
      <div 
        className="absolute inset-0 bg-black"
        style={{ opacity: config.overlayOpacity }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ClassroomEnvironment;
