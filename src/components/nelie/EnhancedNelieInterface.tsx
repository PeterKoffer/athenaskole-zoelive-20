
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Volume2, VolumeX, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedNelieInterfaceProps {
  currentSubject: string;
  currentActivity: string;
  studentNeedsHelp: boolean;
  onHelpProvided: (helpType: string) => void;
}

const EnhancedNelieInterface = ({
  currentSubject,
  currentActivity,
  studentNeedsHelp,
  onHelpProvided
}: EnhancedNelieInterfaceProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleHelpRequest = (helpType: string) => {
    onHelpProvided(helpType);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="mb-4"
          >
            <Card className="bg-purple-600 text-white border-purple-400 max-w-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🤖</span>
                  <span className="font-bold">Nelie</span>
                  {isSpeaking && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Volume2 className="w-4 h-4" />
                    </motion.div>
                  )}
                </div>
                <p className="text-sm mb-3">
                  I'm here to help with your {currentSubject} {currentActivity}!
                </p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleHelpRequest('hint')}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Hint
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleHelpRequest('explanation')}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    Explain
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="rounded-full w-16 h-16 bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default EnhancedNelieInterface;
