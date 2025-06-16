
import React from 'react';
import { Card } from './card';
import TextWithSpeaker from '../education/components/shared/TextWithSpeaker';

interface SpeakableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  speakText: string;
  context: string;
}

const SpeakableCard = ({ children, speakText, context, className = '', ...props }: SpeakableCardProps) => {
  return (
    <TextWithSpeaker
      text={speakText}
      context={context}
      position="corner"
      className={`group h-full ${className}`}
      showOnHover={false}
    >
      <Card {...props} className="relative bg-transparent border-gray-700">
        {children}
      </Card>
    </TextWithSpeaker>
  );
};

export { SpeakableCard };
