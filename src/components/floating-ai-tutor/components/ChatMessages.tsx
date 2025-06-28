
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '../../ui/scroll-area';
import { Card } from '../../ui/card';
import RobotAvatar from '../../ai-tutor/RobotAvatar';
import { Message } from '../types';

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
              {message.role === 'assistant' && (
                <RobotAvatar size="sm" isActive={true} className="flex-shrink-0" />
              )}
              
              <Card className={`px-3 py-2 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-100 border-gray-700'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </Card>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  U
                </div>
              )}
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <RobotAvatar size="lg" isActive={true} className="mx-auto mb-4" />
            <p>Hi! I'm Nelie, your AI learning companion!</p>
            <p className="text-sm mt-2">Ask me anything about your studies!</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
