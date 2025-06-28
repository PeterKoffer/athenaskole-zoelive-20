
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Volume2, Lightbulb, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { ScenarioDefinition, ScenarioNode, ScenarioSession } from '@/types/scenario';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';

interface ScenarioPlayerProps {
  scenario: ScenarioDefinition;
  onComplete: () => void;
  onExit: () => void;
}

const ScenarioPlayer: React.FC<ScenarioPlayerProps> = ({
  scenario,
  onComplete,
  onExit
}) => {
  const [session, setSession] = useState<ScenarioSession | null>(null);
  const [currentNode, setCurrentNode] = useState<ScenarioNode | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  console.log('🎭 ScenarioPlayer rendering with scenario:', scenario.title);

  // Initialize session
  useEffect(() => {
    const newSession: ScenarioSession = {
      sessionId: `session-${Date.now()}`,
      scenarioId: scenario.id,
      userId: 'test-user-123', // In real app, get from auth
      currentNodeId: scenario.entryNodeId,
      visitedNodes: [],
      responses: {},
      timestamps: {
        startedAt: new Date(),
        lastActiveAt: new Date()
      },
      status: 'active',
      progress: {
        percentComplete: 0,
        nodesCompleted: 0,
        totalNodes: scenario.nodes.length,
        score: 0
      }
    };
    
    setSession(newSession);
    
    // Find and set the entry node
    const entryNode = scenario.nodes.find(node => node.id === scenario.entryNodeId);
    if (entryNode) {
      setCurrentNode(entryNode);
      // Auto-speak the initial content
      setTimeout(() => {
        speakAsNelie(entryNode.content, true, 'scenario-content');
      }, 1000);
    }
    
    console.log('🎭 Session initialized:', newSession);
  }, [scenario]);

  const handleSpeak = async () => {
    if (!currentNode) return;
    
    if (isSpeaking) {
      stop();
    } else {
      await speakAsNelie(currentNode.content, true, 'scenario-content');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    console.log('📝 Answer selected:', answer);
  };

  const handleSubmitAnswer = () => {
    if (!currentNode || !session) return;
    
    const correctAnswer = currentNode.config.customProperties?.correctAnswer;
    const isAnswerCorrect = selectedAnswer === correctAnswer;
    
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    setAttempts(prev => prev + 1);
    
    if (isAnswerCorrect) {
      setScore(prev => prev + 10);
      speakAsNelie("Correct! Great job!", true, 'result-feedback');
    } else {
      speakAsNelie("That's not quite right. Let me help you with that.", true, 'result-feedback');
    }
    
    // Update session
    const updatedSession: ScenarioSession = {
      ...session,
      responses: {
        ...session.responses,
        [currentNode.id]: {
          answer: selectedAnswer,
          correct: isAnswerCorrect,
          attempts: attempts + 1,
          timestamp: new Date()
        }
      }
    };
    setSession(updatedSession);
    
    console.log('🎯 Answer submitted:', { selectedAnswer, correctAnswer, isAnswerCorrect });
  };

  const handleContinue = () => {
    if (!currentNode || !session) return;
    
    setShowResult(false);
    setSelectedAnswer('');
    
    // Determine next node based on branching logic
    let nextNodeId: string | null = null;
    
    if (currentNode.connections.branches) {
      const branch = currentNode.connections.branches.find(b => 
        (b.condition === 'correct' && isCorrect) ||
        (b.condition === 'incorrect' && !isCorrect)
      );
      nextNodeId = branch?.targetNodeId || currentNode.connections.fallback || null;
    } else {
      nextNodeId = currentNode.connections.next || null;
    }
    
    if (nextNodeId) {
      const nextNode = scenario.nodes.find(node => node.id === nextNodeId);
      if (nextNode) {
        setCurrentNode(nextNode);
        
        // Update session progress
        const visitedNodes = [...session.visitedNodes, currentNode.id];
        const updatedSession: ScenarioSession = {
          ...session,
          currentNodeId: nextNodeId,
          visitedNodes,
          progress: {
            ...session.progress,
            nodesCompleted: visitedNodes.length,
            percentComplete: Math.round((visitedNodes.length / scenario.nodes.length) * 100),
            score
          },
          timestamps: {
            ...session.timestamps,
            lastActiveAt: new Date()
          }
        };
        setSession(updatedSession);
        
        // Auto-speak new content
        setTimeout(() => {
          speakAsNelie(nextNode.content, true, 'scenario-content');
        }, 500);
        
        console.log('➡️ Moving to next node:', nextNodeId);
      }
    } else {
      // Scenario complete
      console.log('🎉 Scenario completed!');
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (session) {
      const finalSession: ScenarioSession = {
        ...session,
        status: 'completed',
        timestamps: {
          ...session.timestamps,
          completedAt: new Date()
        }
      };
      setSession(finalSession);
      console.log('✅ Final session:', finalSession);
    }
    
    speakAsNelie("Congratulations! You've completed the scenario!", true, 'completion');
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (!currentNode || !session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading scenario...</div>
      </div>
    );
  }

  const progressPercent = session.progress.percentComplete;

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onExit}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">{scenario.title}</h1>
              <p className="text-sm text-gray-400">
                Progress: {session.progress.nodesCompleted}/{session.progress.totalNodes} • Score: {score}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleSpeak}
              variant="ghost"
              size="sm"
              className={`${isSpeaking ? 'text-blue-400' : 'text-gray-400'} hover:text-white`}
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progressPercent} className="w-full h-2" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Area */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>{currentNode.title}</span>
                  <span className="text-sm font-normal text-gray-400 capitalize">
                    {currentNode.type}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Node Content */}
                  <div className="text-gray-300 leading-relaxed">
                    {currentNode.content}
                  </div>

                  {/* Question Options */}
                  {currentNode.type === 'question' && currentNode.config.customProperties?.options && (
                    <div className="space-y-3">
                      <h3 className="text-white font-medium">Choose your answer:</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {currentNode.config.customProperties.options.map((option: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={showResult}
                            className={`p-3 text-left rounded-lg border transition-all ${
                              selectedAnswer === option
                                ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                                : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                            } ${showResult ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Result Display */}
                  {showResult && (
                    <div className={`p-4 rounded-lg border ${
                      isCorrect
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-red-500 bg-red-500/10'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {isCorrect ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className={`font-medium ${
                          isCorrect ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {isCorrect ? 'Correct!' : 'Not quite right'}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {isCorrect
                          ? 'Great job! You got it right.'
                          : `The correct answer is: ${currentNode.config.customProperties?.correctAnswer}`
                        }
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    {currentNode.type === 'question' && !showResult && (
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!selectedAnswer}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Submit Answer
                      </Button>
                    )}
                    
                    {(currentNode.type !== 'question' || showResult) && (
                      <Button
                        onClick={handleContinue}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nelie Avatar Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Nelie - Your AI Tutor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <RobotAvatar 
                    size="xl" 
                    isActive={true} 
                    isSpeaking={isSpeaking}
                  />
                  
                  <div className="text-center">
                    <p className="text-gray-300 text-sm mb-3">
                      I'm here to help you learn! Click the speaker button to hear me read the content.
                    </p>
                    
                    {currentNode.config.allowHints && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Get Hint
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            <Card className="bg-gray-800 border-gray-700 mt-4">
              <CardHeader>
                <CardTitle className="text-white text-sm">Learning Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {currentNode.educational.learningObjectives.map((objective, index) => (
                    <li key={index} className="text-gray-300 text-xs flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPlayer;
