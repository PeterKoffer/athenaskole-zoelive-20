
// Educational Simulator Interface - Main React component

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Clock, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Target, 
  Brain,
  TrendingUp,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { simulatorEngine } from '@/services/simulator/SimulatorEngine';
import { 
  SimulatorSession, 
  DecisionNode, 
  DecisionOption,
  SimulatorAnalytics 
} from '@/types/simulator/SimulatorTypes';

interface SimulatorInterfaceProps {
  scenarioId: string;
  userId: string;
  teamId?: string;
  onComplete?: (analytics: SimulatorAnalytics) => void;
  onExit?: () => void;
}

const SimulatorInterface: React.FC<SimulatorInterfaceProps> = ({
  scenarioId,
  userId,
  teamId,
  onComplete,
  onExit
}) => {
  const [session, setSession] = useState<SimulatorSession | null>(null);
  const [currentNode, setCurrentNode] = useState<DecisionNode | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [reasoning, setReasoning] = useState<string>('');
  const [isProcessingDecision, setIsProcessingDecision] = useState(false);
  const [currentState, setCurrentState] = useState<any>(null);
  const [showConsequences, setShowConsequences] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize simulation
  useEffect(() => {
    const initializeSimulation = async () => {
      try {
        console.log('🎮 Initializing educational simulation...');
        const newSession = await simulatorEngine.startSession(scenarioId, userId, teamId);
        setSession(newSession);
        
        const state = simulatorEngine.getCurrentState();
        setCurrentState(state);
        setCurrentNode(state?.node || null);
      } catch (error) {
        console.error('Failed to initialize simulation:', error);
      }
    };

    initializeSimulation();
  }, [scenarioId, userId, teamId]);

  // Handle decision making
  const handleDecision = async () => {
    if (!selectedOption || !session) return;

    setIsProcessingDecision(true);
    
    try {
      console.log('⚡ Processing educational decision:', { selectedOption, reasoning });
      
      const result = await simulatorEngine.makeDecision(selectedOption, reasoning);
      
      // Show consequences
      setShowConsequences(result.consequences);
      
      // Update state
      const newState = simulatorEngine.getCurrentState();
      setCurrentState(newState);
      setCurrentNode(result.nextNode);
      
      // Check if simulation is completed
      if (!result.nextNode || newState?.isCompleted) {
        setIsCompleted(true);
        
        // Generate final analytics
        const analytics = await simulatorEngine.generateAnalytics();
        if (analytics && onComplete) {
          onComplete(analytics);
        }
      }
      
      // Reset selection
      setSelectedOption('');
      setReasoning('');
      
    } catch (error) {
      console.error('Error processing decision:', error);
    } finally {
      setIsProcessingDecision(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const formatResource = (resourceId: string, amount: number) => {
    if (resourceId.includes('budget')) {
      return `$${amount.toLocaleString()}`;
    } else if (resourceId.includes('time')) {
      return `${amount} hours`;
    }
    return amount.toString();
  };

  if (!session || !currentNode || !currentState) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading simulation...</div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <CardTitle className="text-white text-3xl">Simulation Complete!</CardTitle>
              <p className="text-gray-300 mt-2">
                You have successfully navigated through this complex educational scenario.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-900/30 p-4 rounded-lg text-center">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">Cross-Curricular Learning</div>
                  <div className="text-blue-300 text-sm">Integrated multiple subjects</div>
                </div>
                <div className="bg-green-900/30 p-4 rounded-lg text-center">
                  <Brain className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">Critical Thinking</div>
                  <div className="text-green-300 text-sm">Complex problem solving</div>
                </div>
                <div className="bg-purple-900/30 p-4 rounded-lg text-center">
                  <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">Real-World Skills</div>
                  <div className="text-purple-300 text-sm">Applied knowledge</div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => onExit?.()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View Detailed Analytics
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => onExit?.()}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with session info */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white text-2xl font-bold">Educational Simulation</h1>
            <Button 
              variant="ghost" 
              onClick={onExit}
              className="text-gray-400 hover:text-white"
            >
              Exit Simulation
            </Button>
          </div>
          
          {/* Resource and status indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(currentState.resources).map(([resourceId, amount]) => (
              <Card key={resourceId} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    {resourceId.includes('budget') ? <DollarSign className="w-5 h-5 text-green-400 mr-2" /> :
                     resourceId.includes('time') ? <Clock className="w-5 h-5 text-blue-400 mr-2" /> :
                     <Target className="w-5 h-5 text-purple-400 mr-2" />}
                    <div>
                      <div className="text-white font-semibold">
                        {formatResource(resourceId, amount as number)}
                      </div>
                      <div className="text-gray-400 text-sm capitalize">
                        {resourceId.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main simulation content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main scenario panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current situation */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                    {currentNode.title}
                  </CardTitle>
                  <Badge className={`${getUrgencyColor(currentNode.urgency)} text-white`}>
                    {currentNode.urgency.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {currentNode.situation}
                </p>
                
                {/* Available information */}
                {currentNode.information.complete.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
                      Confirmed Information
                    </h4>
                    <div className="space-y-2">
                      {currentNode.information.complete.map((info, idx) => (
                        <div key={idx} className="bg-green-900/20 p-3 rounded border-l-4 border-green-400">
                          <p className="text-green-100">{info.content}</p>
                          <div className="flex items-center mt-2 text-sm">
                            <span className="text-green-300">Source: {info.source}</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {info.subjects.join(', ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Partial information */}
                {currentNode.information.partial.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                      Uncertain Information
                    </h4>
                    <div className="space-y-2">
                      {currentNode.information.partial.map((info, idx) => (
                        <div key={idx} className="bg-yellow-900/20 p-3 rounded border-l-4 border-yellow-400">
                          <p className="text-yellow-100">{info.content}</p>
                          <div className="flex items-center mt-2 text-sm">
                            <span className="text-yellow-300">Source: {info.source}</span>
                            <span className="text-yellow-300 ml-4">
                              Reliability: {Math.round(info.reliability * 100)}%
                            </span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {info.subjects.join(', ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Decision options */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">What is your decision?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentNode.options.map((option) => (
                  <div 
                    key={option.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedOption === option.id 
                        ? 'border-blue-500 bg-blue-900/30' 
                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                    }`}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium mb-2">{option.description}</p>
                        
                        {/* Skills required */}
                        {option.skillsRequired.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm text-gray-400 mb-1">Skills Applied:</div>
                            <div className="flex flex-wrap gap-1">
                              {option.skillsRequired.map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Resource costs */}
                        {option.resourceCost.length > 0 && (
                          <div className="text-sm text-gray-400">
                            <span>Costs: </span>
                            {option.resourceCost.map((cost, idx) => (
                              <span key={idx} className="text-red-300">
                                {cost.isPercentage ? `${cost.amount * 100}%` : cost.amount} {cost.resourceId.replace(/_/g, ' ')}
                                {idx < option.resourceCost.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedOption === option.id 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-400'
                        }`} />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Reasoning input */}
                {selectedOption && (
                  <div className="mt-6">
                    <label className="text-white font-medium mb-2 block">
                      Explain your reasoning (optional):
                    </label>
                    <Textarea
                      value={reasoning}
                      onChange={(e) => setReasoning(e.target.value)}
                      placeholder="Why did you choose this option? What factors influenced your decision?"
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>
                )}

                {/* Decision button */}
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={handleDecision}
                    disabled={!selectedOption || isProcessingDecision}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                  >
                    {isProcessingDecision ? 'Processing Decision...' : 'Make Decision'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Show consequences if any */}
            {showConsequences.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Consequences of Your Decision</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {showConsequences.map((consequence, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded border-l-4 ${
                          consequence.type === 'positive' ? 'bg-green-900/20 border-green-400' :
                          consequence.type === 'negative' ? 'bg-red-900/20 border-red-400' :
                          'bg-blue-900/20 border-blue-400'
                        }`}
                      >
                        <p className={`${
                          consequence.type === 'positive' ? 'text-green-100' :
                          consequence.type === 'negative' ? 'text-red-100' :
                          'text-blue-100'
                        }`}>
                          {consequence.description}
                        </p>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {consequence.subjects?.join(', ')}
                          </Badge>
                          <Badge 
                            className={`ml-2 text-xs ${
                              consequence.impact === 'high' ? 'bg-red-600' :
                              consequence.impact === 'medium' ? 'bg-yellow-600' :
                              'bg-green-600'
                            }`}
                          >
                            {consequence.impact} impact
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar with stakeholders and performance */}
          <div className="space-y-6">
            {/* Stakeholder relations */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Stakeholder Relations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(currentState.stakeholders).map(([stakeholderId, relations]: [string, any]) => (
                    <div key={stakeholderId}>
                      <div className="text-white font-medium mb-2 capitalize">
                        {stakeholderId.replace(/_/g, ' ')}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Satisfaction</span>
                            <span className="text-white">{Math.round(relations.satisfaction * 100)}%</span>
                          </div>
                          <Progress value={relations.satisfaction * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Trust</span>
                            <span className="text-white">{Math.round(relations.trust * 100)}%</span>
                          </div>
                          <Progress value={relations.trust * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance indicators */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Performance Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Resource Efficiency</div>
                    <Progress value={currentState.performance.resourceEfficiency * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Time Management</div>
                    <Progress value={currentState.performance.timeManagement * 100} className="h-2" />
                  </div>
                  
                  {/* Skills demonstrated */}
                  {Object.keys(currentState.performance.skillDemonstration).length > 0 && (
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Skills Demonstrated</div>
                      <div className="space-y-2">
                        {Object.entries(currentState.performance.skillDemonstration).map(([skill, level]: [string, any]) => (
                          <div key={skill}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-300">{skill}</span>
                              <span className="text-white">{Math.round(level * 100)}%</span>
                            </div>
                            <Progress value={level * 100} className="h-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills being assessed */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Skills Being Assessed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentNode.skillsAssessed.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="mr-2 mb-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorInterface;
