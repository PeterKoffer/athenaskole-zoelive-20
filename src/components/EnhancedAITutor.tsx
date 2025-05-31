
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import LanguageLearning from "./LanguageLearning";
import LanguageSelector from "./ai-tutor/LanguageSelector";
import DailyChallenges from "./gamification/DailyChallenges";
import RewardsSystem from "./gamification/RewardsSystem";
import ParentNotifications from "./parent/ParentNotifications";
import WelcomeCard from "./ai-tutor/WelcomeCard";
import TutorHeader from "./ai-tutor/TutorHeader";
import ChatTab from "./ai-tutor/ChatTab";
import SpeechTab from "./ai-tutor/SpeechTab";
import { useMessageHandler } from "./ai-tutor/useMessageHandler";

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

  // Mock child progress data for parent notifications
  const childProgress = {
    childName: user?.user_metadata?.name?.split(' ')[0] || "Emma",
    weeklyMinutes: 95,
    completedLessons: 8,
    pronunciationScore: 87,
    challengesCompleted: 12,
    streak: 5,
    newAchievements: ["Pronunciation Master", "7 Day Streak"]
  };

  const handleLearningOptionWithLanguageCheck = (option) => {
    if (option.id === "language") {
      setShowLanguageSelection(true);
      return;
    }
    if (option.id === "pronunciation") {
      return;
    }
    handleLearningOption(option);
  };

  const handleLanguageSelect = (languageCode) => {
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

  if (showLanguageSelection) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="text-white border-gray-600 hover:bg-gray-700 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowLanguageSelection(false)}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            ← Back to AI Tutor
          </Button>
        </div>
        <LanguageSelector
          onLanguageSelect={handleLanguageSelect}
          onBack={() => setShowLanguageSelection(false)}
        />
      </div>
    );
  }

  if (showLanguageLearning) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="text-white border-gray-600 hover:bg-gray-700 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              setShowLanguageLearning(false);
              setSelectedLanguage("");
            }}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            ← Back to AI Tutor
          </Button>
        </div>
        <LanguageLearning initialLanguage={selectedLanguage} />
      </div>
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
          <ChatTab
            messages={messages}
            isSpeaking={isSpeaking}
            onSendMessage={handleSendMessage}
            onStopSpeaking={stopSpeaking}
            onLearningOptionSelect={handleLearningOptionWithLanguageCheck}
          />
        </TabsContent>

        <TabsContent value="speech" className="space-y-6">
          <SpeechTab
            currentPracticeText={currentPracticeText}
            onPracticeTextChange={setCurrentPracticeText}
            onScoreUpdate={handlePronunciationScore}
          />
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <DailyChallenges onChallengeComplete={handleChallengeComplete} />
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <RewardsSystem 
            currentCoins={currentCoins}
            onPurchase={handleRewardPurchase}
          />
        </TabsContent>

        <TabsContent value="parents" className="space-y-6">
          <ParentNotifications
            childProgress={childProgress}
            parentEmail="parents@example.com"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAITutor;
