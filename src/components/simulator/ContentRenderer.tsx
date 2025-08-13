import React from 'react';

interface Content { type: 'video' | 'image' | 'text'; value: string };

interface ContentRendererProps {
  content: Content[];
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  return (
    <div>
      {content.map((item, index) => {
        switch (item.type) {
          case 'video':
            return <video key={index} src={item.value} controls />;
          case 'image':
            return (
              <img
                key={index}
                src={item.value || "/images/placeholder-16x9.png"}
                alt=""
                className="w-full aspect-video object-cover rounded-2xl bg-slate-100"
              />
            );
          case 'text':
            return <p key={index}>{item.value}</p>;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default ContentRenderer;
