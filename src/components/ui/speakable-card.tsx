
import React from 'react';
import { Card, CardProps } from './card';
import TextWithSpeaker from '../education/components/shared/TextWithSpeaker';

interface SpeakableCardProps extends CardProps {
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
    >
      <Card {...props} className={props.className}>
        {children}
      </Card>
    </TextWithSpeaker>
  );
};

export { SpeakableCard };
