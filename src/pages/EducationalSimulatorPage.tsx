
// Educational Simulator Demo Page

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Users, 
  Target, 
  Clock, 
  TrendingUp, 
  BookOpen,
  Play,
  ArrowLeft,
  Award,
  BarChart3
} from 'lucide-react';
import SimulatorInterface from '@/components/simulator/SimulatorInterface';
import { SimulatorAnalytics } from '@/types/simulator/SimulatorTypes';

const EducationalSimulatorPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'overview' | 'simulation' | 'analytics'>('overview');
  const [simulationAnalytics, setSimulationAnalytics] = useState<SimulatorAnalytics | null>(null);

  const handleStartSimulation = () => {
    setCurrentView('simulation');
  };

  const handleSimulationComplete = (analytics: SimulatorAnalytics) => {
    setSimulationAnalytics(analytics);
    setCurrentView('analytics');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSimulationAnalytics(null);
  };

  if (currentView === 'simulation') {
    return (
      <SimulatorInterface
        studentProfile={{}}
        onComplete={handleSimulationComplete}
        onExit={handleBackToOverview}
      />
    );
  }

  if (currentView === 'analytics') {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToOverview}
              className="text-gray-400 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
            <h1 className="text-white text-3xl font-bold">Simulation Analytics & Debrief</h1>
            <p className="text-gray-300 mt-2">
              Comprehensive analysis of your learning experience and performance
            </p>
          </div>

          {simulationAnalytics && (
            <div className="space-y-6">
              {/* Overall Performance */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-400" />
                    Overall Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400">
                        {Math.round(simulationAnalytics.overallPerformance * 100)}%
                      </div>
                      <div className="text-gray-300">Overall Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">
                        {simulationAnalytics.decisionAnalysis.length}
                      </div>
                      <div className="text-gray-300">Decisions Made</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">
                        {Object.keys(simulationAnalytics.skillDemonstration).length}
                      </div>
                      <div className="text-gray-300">Skills Demonstrated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">
                        {Object.keys(simulationAnalytics.subjectPerformance).length}
                      </div>
                      <div className="text-gray-300">Subjects Integrated</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subject Performance */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                    Cross-Curricular Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(simulationAnalytics.subjectPerformance).map(([subject, score]) => (
                      <div key={subject} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">{subject}</span>
                          <span className="text-blue-400 font-bold">
                            {Math.round((score as number) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(score as number) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skills Analysis */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    Skills Demonstrated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(simulationAnalytics.skillDemonstration).map(([skill, level]) => (
                      <div key={skill} className="text-center">
                        <div className="text-lg font-semibold text-white mb-1">{skill}</div>
                        <div className="text-purple-400 text-2xl font-bold">
                          {Math.round((level as number) * 100)}%
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${(level as number) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Decision Analysis */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                    Decision Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {simulationAnalytics.decisionAnalysis.map((decision, idx) => (
                      <div key={idx} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">Decision Point {idx + 1}</span>
                          <Badge className={`${
                            decision.effectiveness > 0.8 ? 'bg-green-600' :
                            decision.effectiveness > 0.6 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}>
                            {Math.round(decision.effectiveness * 100)}% Effective
                          </Badge>
                        </div>
                        <div className="text-gray-300 text-sm">
                          Skills assessed: {Object.keys(decision.skillsAssessed || {}).join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Strengths and Improvement Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {simulationAnalytics.strengths.map((strength, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                          <span className="text-gray-300">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Target className="w-5 h-5 mr-2 text-orange-400" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {simulationAnalytics.improvementAreas.map((area, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                          <span className="text-gray-300">{area}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action buttons */}
              <div className="flex justify-center space-x-4">
                <Button onClick={handleStartSimulation} className="bg-blue-600 hover:bg-blue-700">
                  Try Another Scenario
                </Button>
                <Button variant="outline" onClick={handleBackToOverview}>
                  Explore More Simulations
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Overview page
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-white text-4xl font-bold mb-4">
            Educational Simulator Platform
          </h1>
          <p className="text-gray-300 text-xl mb-6 max-w-4xl mx-auto">
            Experience immersive, cross-curricular learning through realistic scenarios 
            that bridge the gap between theoretical knowledge and practical application.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge className="bg-blue-600 text-lg px-4 py-2">Cross-Curricular Learning</Badge>
            <Badge className="bg-green-600 text-lg px-4 py-2">Real-World Applications</Badge>
            <Badge className="bg-purple-600 text-lg px-4 py-2">Critical Thinking</Badge>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-3">Active Learning</h3>
              <p className="text-gray-300">
                Learn by doing through immersive scenarios that require critical thinking and decision-making.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-3">Safe-to-Fail Environment</h3>
              <p className="text-gray-300">
                Experiment with different strategies and learn from mistakes without real-world consequences.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-3">Comprehensive Analytics</h3>
              <p className="text-gray-300">
                Detailed performance analysis and insights for meaningful post-simulation debriefing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sample Scenario */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center">
              <Target className="w-6 h-6 mr-3 text-red-400" />
              Featured Scenario: Environmental Crisis Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-semibold mb-3">Scenario Overview</h4>
                <p className="text-gray-300 mb-4">
                  Lead a cross-functional team through an environmental crisis affecting your community. 
                  A chemical spill threatens the water supply, and you must make critical decisions to 
                  protect public health while managing stakeholder relations and limited resources.
                </p>

                <h4 className="text-white font-semibold mb-3">Integrated Subjects</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">Environmental Science</Badge>
                  <Badge variant="secondary">Mathematics</Badge>
                  <Badge variant="secondary">Social Studies</Badge>
                  <Badge variant="secondary">English Communication</Badge>
                </div>

                <h4 className="text-white font-semibold mb-3">Skills Developed</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                    <span className="text-gray-300">Crisis management and decision-making under pressure</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                    <span className="text-gray-300">Scientific data analysis and interpretation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                    <span className="text-gray-300">Stakeholder communication and ethical reasoning</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3" />
                    <span className="text-gray-300">Resource allocation and mathematical modeling</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">What Makes This Different</h4>
                <div className="space-y-4">
                  <div className="bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="text-blue-300 font-medium">Real-Time Pressure</span>
                    </div>
                    <p className="text-blue-100 text-sm">
                      Time-sensitive decisions with cascading consequences create authentic urgency.
                    </p>
                  </div>

                  <div className="bg-green-900/20 p-4 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-center mb-2">
                      <Users className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-green-300 font-medium">Multiple Stakeholders</span>
                    </div>
                    <p className="text-green-100 text-sm">
                      Balance competing interests and manage complex relationships.
                    </p>
                  </div>

                  <div className="bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-400">
                    <div className="flex items-center mb-2">
                      <Brain className="w-4 h-4 text-purple-400 mr-2" />
                      <span className="text-purple-300 font-medium">Incomplete Information</span>
                    </div>
                    <p className="text-purple-100 text-sm">
                      Make decisions with partial data, just like in real-world situations.
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleStartSimulation}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Simulation
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Educational Philosophy */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">Our Educational Philosophy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">Beyond Traditional Q&A</h4>
                <p className="text-gray-300 mb-4">
                  Our simulations go far beyond simple question-and-answer formats. Students are placed 
                  in realistic scenarios where they must make complex decisions, manage resources, and 
                  experience the consequences of their actions.
                </p>
                <p className="text-gray-300">
                  This approach fosters deep learning, critical thinking, and the development of 
                  real-world skills that traditional educational methods often struggle to teach.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">The Power of Debrief</h4>
                <p className="text-gray-300 mb-4">
                  The most profound learning happens during post-simulation analysis. Our platform 
                  provides comprehensive analytics and discussion questions that help connect the 
                  simulation experience to core learning objectives.
                </p>
                <p className="text-gray-300">
                  Students gain insights not just into what happened, but why it happened and 
                  how different choices might have led to different outcomes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EducationalSimulatorPage;
