
import ChatTab from "../ChatTab";
import { Message, LearningOption } from "../types";

interface EnhancedTutorChatTabProps {
  messages: Message[];
  isSpeaking: boolean;
  onSendMessage: (message: string) => void;
  onStopSpeaking: () => void;
  onLearningOptionSelect: (option: LearningOption) => void;
}

const EnhancedTutorChatTab = ({
  messages,
  isSpeaking,
  onSendMessage,
  onStopSpeaking,
  onLearningOptionSelect,
}: EnhancedTutorChatTabProps) => (
  <ChatTab
    messages={messages}
    isSpeaking={isSpeaking}
    onSendMessage={onSendMessage}
    onStopSpeaking={onStopSpeaking}
    onLearningOptionSelect={onLearningOptionSelect}
  />
);

export default EnhancedTutorChatTab;
