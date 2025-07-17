
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EnhancedAITutor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const handleCompleteChallenge = (challengeId: string) => {
    console.log('Challenge completed:', challengeId);
  };

  const handleEarnReward = (rewardId: string) => {
    console.log('Reward earned:', rewardId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-center text-2xl">Enhanced AI Learning Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">AI Chat</TabsTrigger>
              <TabsTrigger value="speech">Speech Practice</TabsTrigger>
              <TabsTrigger value="games">Learning Games</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="mt-6">
              <div className="text-center text-white">
                <h3 className="text-xl mb-4">AI Chat Interface</h3>
                <p className="text-gray-300">Interactive conversation with your AI tutor</p>
              </div>
            </TabsContent>
            
            <TabsContent value="speech" className="mt-6">
              <div className="text-center text-white">
                <h3 className="text-xl mb-4">Speech Practice</h3>
                <p className="text-gray-300">Practice pronunciation and speaking skills</p>
              </div>
            </TabsContent>
            
            <TabsContent value="games" className="mt-6">
              <div className="text-center text-white">
                <h3 className="text-xl mb-4">Learning Games</h3>
                <p className="text-gray-300">Engaging educational games and challenges</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAITutor;
