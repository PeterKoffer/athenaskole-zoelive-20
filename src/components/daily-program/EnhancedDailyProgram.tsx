
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, Gamepad2, Target, Brain, Calendar } from 'lucide-react';
import { DailyLessonOrchestrator, DailyLessonPlan, DailyActivity } from '@/services/dailyLessonOrchestrator';
import { useToast } from '@/hooks/use-toast';

const EnhancedDailyProgram = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dailyPlan, setDailyPlan] = useState<DailyLessonPlan | null>(null);
  const [currentActivity, setCurrentActivity] = useState<D

I'll continue with the remaining components to complete your extraordinary AI school system:

<lov-write file_path="src/components/nelie/EnhancedNelieInterface.tsx">
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, MessageCircle, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { motion, AnimatePresence } from 'framer-motion';

interface NelieMessage {
  id: string;
  type: 'nelie' | 'student';
  content: string;
  timestamp: Date;
  context?: string;
  helpful?: boolean;
}

interface EnhancedNelieInterfaceProps {
  currentSubject?: string;
  currentActivity?: string;
  studentNeedsHelp?: boolean;
  onHelpProvided?: (helpType: string) => void;
}

const EnhancedNelieInterface = ({ 
  currentSubject = 'mathematics',
  currentActivity = 'learning',
  studentNeedsHelp = false,
  onHelpProvided = () => {}
}: EnhancedNelieInterfaceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<NelieMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [nelieState, setNelieState] = useState<'listening' | 'thinking' | 'speaking' | 'idle'>('idle');
  
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  // Initialize Nelie with welcoming message
  useEffect(() => {
    const welcomeMessage: NelieMessage = {
      id: 'welcome',
      type: 'nelie',
      content: `Hi there! I'm Nelie, your AI learning companion! I'm here to help you with ${currentSubject} and make learning fun and engaging. Feel free to ask me anything!`,
      timestamp: new Date(),
      context: 'greeting'
    };
    setMessages([welcomeMessage]);
    
    // Speak welcome message
    setTimeout(() => {
      speakAsNelie(welcomeMessage.content, false, 'nelie-welcome');
    }, 1000);
  }, [currentSubject, speakAsNelie]);

  // Respond to student needing help
  useEffect(() => {
    if (studentNeedsHelp && !isExpanded) {
      setIsExpanded(true);
      offerContextualHelp();
    }
  }, [studentNeedsHelp, isExpanded]);

  const offerContextualHelp = () => {
    const helpMessages = {
      mathematics: {
        practice: "I notice you might need some help with this math problem! Remember, breaking it down step by step often makes it easier. Would you like me to walk through it with you?",
        game: "Having fun with this math game? If you get stuck, try thinking about what patterns you see. I'm here if you need a hint!",
        assessment: "You're doing great! Take your time and trust what you've learned. Remember, I believe in you!"
      },
      general: "I'm here to help! Don't hesitate to ask me anything about what you're learning. We're in this together!"
    };

    const helpContent = helpMessages[currentSubject as keyof typeof helpMessages]?.[currentActivity as keyof typeof helpMessages.mathematics] || helpMessages.general;
    
    const helpMessage: NelieMessage = {
      id: `help-${Date.now()}`,
      type: 'nelie',
      content: helpContent,
      timestamp: new Date(),
      context: 'contextual_help'
    };

    setMessages(prev => [...prev, helpMessage]);
    speakAsNelie(helpContent, true, 'nelie-help-offer');
    onHelpProvided('contextual_offer');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const studentMessage: NelieMessage = {
      id: `student-${Date.now()}`,
      type: 'student', 
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, studentMessage]);
    setInputMessage('');
    setIsTyping(true);
    setNelieState('thinking');

    // Simulate Nelie thinking and responding
    setTimeout(async () => {
      const nelieResponse = await generateNelieResponse(inputMessage, currentSubject, currentActivity);
      
      const nelieMessage: NelieMessage = {
        id: `nelie-${Date.now()}`,
        type: 'nelie',
        content: nelieResponse,
        timestamp: new Date(),
        context: 'conversation'
      };

      setMessages(prev => [...prev, nelieMessage]);
      setIsTyping(false);
      setNelieState('speaking');
      
      // Speak Nelie's response
      await speakAsNelie(nelieResponse, true, 'nelie-response');
      setNelieState('idle');
      
      onHelpProvided('direct_assistance');
    }, 1500);
  };

  const generateNelieResponse = async (question: string, subject: string, activity: string): Promise<string> => {
    // Enhanced response generation based on context
    const questionLower = question.toLowerCase();
    
    // Math-specific help responses
    if (subject === 'mathematics') {
      if (questionLower.includes('stuck') || questionLower.includes('don\'t understand')) {
        return "I understand it can feel challenging! Let's break this down together. What specific part is confusing you? Remember, every mathematician gets stuck sometimes - it's part of learning!";
      }
      
      if (questionLower.includes('how') && (questionLower.includes('solve') || questionLower.includes('calculate'))) {
        return "Great question! The best approach is to start with what you know. Can you identify the key information in the problem? Then we can work step by step toward the solution!";
      }
      
      if (questionLower.includes('why') || questionLower.includes('explain')) {
        return "I love that you're asking 'why' - that shows real mathematical thinking! Understanding the 'why' helps us remember and apply concepts better. Let me help you see the connection...";
      }
    }

    // General encouraging responses
    const encouragingResponses = [
      "That's a thoughtful question! Your curiosity is exactly what makes learning exciting. Let me help you explore this...",
      "I'm so glad you asked! Questions like yours help us dive deeper into understanding. Here's what I think...",
      "What a great way to think about this! Your question shows you're really engaging with the material. Let me share some insights...",
      "I can tell you're thinking carefully about this. That's exactly the kind of thinking that leads to real understanding!"
    ];

    return encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)];
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleVolumeToggle = () => {
    if (isSpeaking) {
      stop();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-96 h-[500px]"
          >
            <Card className="h-full bg-gradient-to-br from-purple-900 to-blue-900 border-purple-500 shadow-2xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                      <motion.div
                        animate={{ 
                          scale: nelieState === 'speaking' ? [1, 1.2, 1] : 1,
                          rotate: nelieState === 'thinking' ? 360 : 0
                        }}
                        transition={{ 
                          duration: nelieState === 'speaking' ? 0.5 : 2,
                          repeat: nelieState === 'thinking' ? Infinity : 0
                        }}
                        className="absolute inset-0"
                      >
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Nelie</h3>
                      <p className="text-purple-200 text-xs">Your AI Learning Companion</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleVolumeToggle}
                      className="text-white hover:bg-purple-700"
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleExpanded}
                      className="text-white hover:bg-purple-700"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="h-full flex flex-col p-4">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'student' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'student' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-purple-700 text-purple-100'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-purple-700 text-purple-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-2 h-2 bg-purple-300 rounded-full"
                          />
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-purple-300 rounded-full"
                          />
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 bg-purple-300 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <div className="flex space-x-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask Nelie anything..."
                    className="flex-1 min-h-[40px] max-h-[80px] bg-white/10 border-purple-400 text-white placeholder-purple-200"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              className="cursor-pointer bg-gradient-to-br from-purple-600 to-blue-600 border-purple-400 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={toggleExpanded}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                  <div>
                    <p className="text-white font-semibold text-sm">Nelie</p>
                    <p className="text-purple-200 text-xs">Tap for help!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedNelieInterface;
