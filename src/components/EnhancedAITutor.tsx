
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LanguageLearning from "./LanguageLearning";
import SubjectSelector from "./ai-tutor/SubjectSelector";
import ChatMessage from "./ai-tutor/ChatMessage";
import LearningOptions from "./ai-tutor/LearningOptions";
import ChatInput from "./ai-tutor/ChatInput";
import LanguageSelector from "./ai-tutor/LanguageSelector";
import SpeechRecognition from "./ai-tutor/SpeechRecognition";
import DailyChallenges from "./gamification/DailyChallenges";
import RewardsSystem from "./gamification/RewardsSystem";
import ParentNotifications from "./parent/ParentNotifications";
import { useMessageHandler } from "./ai-tutor/useMessageHandler";
import { Target, Clock, Star } from "lucide-react";

const EnhancedAITutor = ({ user }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSubject, setCurrentSubject] = useState("matematik");
  const [showLanguageLearning, setShowLanguageLearning] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [currentCoins, setCurrentCoins] = useState(150);
  const [showSpeechPractice, setShowSpeechPractice] = useState(false);
  const [currentPracticeText, setCurrentPracticeText] = useState("Hej, jeg hedder Emma");
  const messagesEndRef = useRef(null);

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
    newAchievements: ["Udtale Mester", "7 Dages Streak"]
  };

  const todaysDate = new Date().toLocaleDateString('da-DK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLearningOptionWithLanguageCheck = (option) => {
    if (option.id === "language") {
      setShowLanguageSelection(true);
      return;
    }
    if (option.id === "pronunciation") {
      setShowSpeechPractice(true);
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
    // Could add notifications here
  };

  const handleRewardPurchase = (rewardId: string, cost: number) => {
    setCurrentCoins(prev => prev - cost);
    // Could add purchased item to user profile
  };

  const handlePronunciationScore = (score: number) => {
    // Update challenge progress if pronunciation-related
    console.log(`Pronunciation score: ${score}%`);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (showLanguageSelection) {
    return (
      <LanguageSelector
        onLanguageSelect={handleLanguageSelect}
        onBack={() => setShowLanguageSelection(false)}
      />
    );
  }

  if (showLanguageLearning) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => {
            setShowLanguageLearning(false);
            setSelectedLanguage("");
          }}
          className="text-white border-gray-600 hover:bg-gray-700"
        >
          ← Tilbage til AI Lærer
        </Button>
        <LanguageLearning initialLanguage={selectedLanguage} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Message with Today's Agenda */}
      <Card className="bg-gradient-to-r from-purple-600 to-cyan-600 border-none">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-white">
            <div className="text-4xl">🎓</div>
            <div>
              <h1 className="text-3xl font-bold">Hej {user?.user_metadata?.name?.split(' ')[0] || 'Elev'}! Jeg er Athena</h1>
              <p className="text-purple-100 text-lg">{todaysDate}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <p className="text-xl mb-4">
              Velkommen til din personlige AI-lærer! Jeg har forberedt et spændende program til dig i dag. 
              Du kan vælge hvor du vil starte, og jeg vil guide dig gennem hver aktivitet.
            </p>
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-300" />
              <span className="text-lg">Lad os lære noget fantastisk sammen!</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2 text-white">
              <span className="text-2xl">🎓</span>
              <span>Athena AI Lærer</span>
            </span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-yellow-600 text-white border-yellow-600">
                {currentCoins} ⭐
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SubjectSelector
            currentSubject={currentSubject}
            onSubjectChange={setCurrentSubject}
            onLanguageSelect={() => setShowLanguageSelection(true)}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="chat" className="data-[state=active]:bg-gray-700">AI Chat</TabsTrigger>
          <TabsTrigger value="speech" className="data-[state=active]:bg-gray-700">Udtale</TabsTrigger>
          <TabsTrigger value="challenges" className="data-[state=active]:bg-gray-700">Udfordringer</TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-gray-700">Belønninger</TabsTrigger>
          <TabsTrigger value="parents" className="data-[state=active]:bg-gray-700">Forældre</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <Card className="h-96 bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Chat med din AI lærer</CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message}>
                    {message.showOptions && (
                      <LearningOptions onOptionSelect={handleLearningOptionWithLanguageCheck} />
                    )}
                  </ChatMessage>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <ChatInput
                onSendMessage={handleSendMessage}
                isSpeaking={isSpeaking}
                onStopSpeaking={stopSpeaking}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="speech" className="space-y-6">
          <SpeechRecognition
            targetText={currentPracticeText}
            language="dansk"
            onScoreUpdate={handlePronunciationScore}
          />
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Øvelsestekster</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Hej, jeg hedder Emma",
                  "Jeg kan godt lide at læse bøger",
                  "Danmark er et smukt land",
                  "Jeg spiser rugbrød til morgenmad",
                  "Hygge er meget vigtigt for danskere"
                ].map((text, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => setCurrentPracticeText(text)}
                    className={`text-left justify-start ${
                      currentPracticeText === text
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'text-gray-300 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    {text}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
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
            parentEmail="foraeldre@example.com"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAITutor;
