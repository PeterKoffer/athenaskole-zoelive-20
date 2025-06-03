
import { Message } from "./types";

interface ChatMessageProps {
  message: Message;
  children?: React.ReactNode;
}

const ChatMessage = ({ message, children }: ChatMessageProps) => {
  return (
    <div>
      <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            message.role === 'user'
              ? 'bg-gradient-to-r from-purple-400 to-cyan-400 text-white text-left'
              : 'bg-gray-800 text-gray-100 border border-gray-700 text-left'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          <p className="text-xs opacity-70 mt-1 text-left">
            {message.timestamp.toLocaleTimeString('da-DK')}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ChatMessage;
