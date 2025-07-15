import React from 'react';

interface ContentRendererProps {
  content: any;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
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
