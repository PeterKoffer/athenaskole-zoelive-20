import React from 'react';
import Game from './Game';

interface ContentRendererProps {
  content: any;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  if (content.games) {
    return (
      <div>
        {content.games.map((game: any, index: number) => (
          <Game key={index} game={game} />
        ))}
      </div>
    );
  }

  switch (content.type) {
    case 'video':
      return <video src={content.url} controls />;
    case 'image':
      return <img src={content.url} alt={content.alt} />;
    case 'text':
      return <p>{content.text}</p>;
    default:
      return null;
  }
};

export default ContentRenderer;
