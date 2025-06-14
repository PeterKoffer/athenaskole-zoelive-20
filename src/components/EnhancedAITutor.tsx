import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import LanguageLearning from "./LanguageLearning";
import LanguageSelector from "./ai-tutor/LanguageSelector";
import WelcomeCard from "./ai-tutor/WelcomeCard";
import TutorHeader from "./ai-tutor/TutorHeader";
import { useMessageHandler } from "./ai-tutor/useMessageHandler";
import TutorLanguageSelectionView from "./ai-tutor/TutorLanguageSelectionView";
import TutorLanguageLearningView from "./ai-tutor/TutorLanguageLearningView";
import { getChildProgress } from "./ai-tutor/childProgressUtil";

// --- Added missing tab imports below ---
import EnhancedTutorChatTab from "./ai-tutor/tabs/EnhancedTutorChatTab";
import EnhancedTutorSpeechTab from "./ai-tutor/tabs/EnhancedTutorSpeechTab";
import EnhancedTutorChallengesTab from "./ai-tutor/tabs/EnhancedTutorChallengesTab";
import EnhancedTutorRewardsTab from "./ai-tutor/tabs/EnhancedTutorRewardsTab";
import EnhancedTutorParentsTab from "./ai-tutor/tabs/EnhancedTutorParentsTab";
// --- end import additions ---

interface EnhancedAITutorProps {
  user: any;
  onBack?: () => void;
}

const EnhancedAITutor = ({ user, onBack }: EnhancedAITutorProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSubject, setCurrentSubject] = useState("math");
  const [showLanguageLearning, setShowLanguageLearning] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [currentCoins, setCurrentCoins] = useState(150);
  const [currentPracticeText, setCurrentPracticeText] = useState("Hello, my name is Emma");

  const { messages, handleSendMessage, handleLearningOption } = useMessageHandler({
    user,
    currentSubject,
    setIsSpeaking
  });

  // Child progress for Parents Tab
  const childProgress = getChildProgress(user);

  const handleLearningOptionWithLanguageCheck = (option: any) => {
    if (option.id === "language") {
      setShowLanguageSelection(true);
      return;
    }
    if (option.id === "pronunciation") {
      return;
    }
    handleLearningOption(option);
  };

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setShowLanguageSelection(false);
    setShowLanguageLearning(true);
  };

  const handleChallengeComplete = (challengeId: string, reward: number) => {
    setCurrentCoins(prev => prev + reward);
  };

  const handleRewardPurchase = (rewardId: string, cost: number) => {
    setCurrentCoins(prev => prev - cost);
  };

  const handlePronunciationScore = (score: number) => {
    console.log(`Pronunciation score: ${score}%`);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const userName = user?.user_metadata?.name?.split(' ')[0] || 'Student';

  // Language selection or learning flows
  if (showLanguageSelection) {
    return (
      <TutorLanguageSelectionView
        onBackToHome={onBack}
        onBackToTutor={() => setShowLanguageSelection(false)}
        onLanguageSelect={handleLanguageSelect}
      />
    );
  }

  if (showLanguageLearning) {
    return (
      <TutorLanguageLearningView
        selectedLanguage={selectedLanguage}
        onBackToHome={onBack}
        onBackToTutor={() => {
          setShowLanguageLearning(false);
          setSelectedLanguage("");
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <WelcomeCard userName={userName} />
      <TutorHeader
        currentCoins={currentCoins}
        currentSubject={currentSubject}
        onSubjectChange={setCurrentSubject}
        onLanguageSelect={() => setShowLanguageSelection(true)}
      />
      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="chat" className="data-[state=active]:bg-gray-700 text-white">AI Chat</TabsTrigger>
          <TabsTrigger value="speech" className="data-[state=active]:bg-gray-700 text-white">Speech</TabsTrigger>
          <TabsTrigger value="challenges" className="data-[state=active]:bg-gray-700 text-white">Challenges</TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-gray-700 text-white">Rewards</TabsTrigger>
          <TabsTrigger value="parents" className="data-[state=active]:bg-gray-700 text-white">Parents</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="space-y-6">
          <EnhancedTutorChatTab
            messages={messages}
            isSpeaking={isSpeaking}
            onSendMessage={handleSendMessage}
            onStopSpeaking={stopSpeaking}
            onLearningOptionSelect={handleLearningOptionWithLanguageCheck}
          />
        </TabsContent>
        <TabsContent value="speech" className="space-y-6">
          <EnhancedTutorSpeechTab
            currentPracticeText={currentPracticeText}
            onPracticeTextChange={setCurrentPracticeText}
            onScoreUpdate={handlePronunciationScore}
          />
        </TabsContent>
        <TabsContent value="challenges" className="space-y-6">
          <EnhancedTutorChallengesTab onChallengeComplete={handleChallengeComplete} />
        </TabsContent>
        <TabsContent value="rewards" className="space-y-6">
          <EnhancedTutorRewardsTab
            currentCoins={currentCoins}
            onPurchase={handleRewardPurchase}
          />
        </TabsContent>
        <TabsContent value="parents" className="space-y-6">
          <EnhancedTutorParentsTab childProgress={childProgress} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAITutor;
