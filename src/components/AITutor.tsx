
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { openAIService } from '@/services/OpenAIService';
import { speechService } from '@/services/SpeechService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface LearningOption {
  id: string;
  title: string;
  description: string;
}

interface AITutorProps {
  onBack?: () => void;
}

const AITutor: React.FC<AITutorProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: 'Hello! I\'m your AI tutor. How can I help you learn today?',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await openAIService.generateResponse(message, messages);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLearningOptionSelect = (option: LearningOption) => {
    handleSendMessage(`I'd like to learn about: ${option.title}`);
  };

  const handleSpeechToText = async () => {
    try {
      if (isListening) {
        setIsListening(false);
        await speechService.stopListening();
      } else {
        setIsListening(true);
        const result = await speechService.startListening('en-US');
        if (result) {
          setInputMessage(result);
        }
        setIsListening(false);
      }
    } catch (error) {
      console.error('Speech to text error:', error);
      setIsListening(false);
    }
  };

  const handleTextToSpeech = async (text: string) => {
    try {
      if (isSpeaking) {
        setIsSpeaking(false);
        speechService.stop();
      } else {
        setIsSpeaking(true);
        await speechService.speak(text);
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Text to speech error:', error);
      setIsSpeaking(false);
    }
  };

  const learningOptions: LearningOption[] = [
    { id: '1', title: 'Mathematics', description: 'Algebra, geometry, calculus' },
    { id: '2', title: 'Science', description: 'Physics, chemistry, biology' },
    { id: '3', title: 'Language Arts', description: 'Reading, writing, grammar' },
    { id: '4', title: 'History', description: 'World history, civilizations' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-center">AI Tutor Chat</CardTitle>
          {onBack && (
            <Button variant="outline" onClick={onBack} className="w-fit">
              Back
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-800 rounded-lg">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTextToSpeech(message.content)}
                      className="absolute top-1 right-1 p-1 h-6 w-6"
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </Button>
                  )}
                  <p className="text-sm pr-6">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
              className="flex-1 bg-gray-800 border-gray-600 text-white"
            />
            <Button
              onClick={handleSpeechToText}
              variant={isListening ? 'destructive' : 'outline'}
              size="icon"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button 
              onClick={() => handleSendMessage(inputMessage)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Learning Options */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Quick Learning Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningOptions.map((option) => (
              <Card 
                key={option.id} 
                className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleLearningOptionSelect(option)}
              >
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-2">{option.title}</h3>
                  <p className="text-gray-300 text-sm">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITutor;
