
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScenarioPlayer from '@/components/scenario-engine/ScenarioPlayer';
import { ScenarioDefinition } from '@/types/scenario';

const SimulationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = React.useState<ScenarioDefinition | null>(null);
  
  console.log('🎭 SimulationsPage rendering...');
  
  const handleBack = () => {
    console.log('⬅️ Navigating back...');
    navigate(-1);
  };

  // Sample scenario for testing
  const testScenario: ScenarioDefinition = {
    id: "test-math-scenario-1",
    title: "Basic Addition Adventure",
    description: "Learn addition through an interactive story scenario",
    educational: {
      subject: "mathematics",
      gradeLevel: 2,
      difficulty: 3,
      estimatedDuration: 15,
      learningOutcomes: [
        "Understand basic addition concepts",
        "Apply addition in real-world scenarios",
        "Build confidence with numbers"
      ],
      prerequisites: ["Counting to 20", "Number recognition"]
    },
    nodes: [
      {
        id: "welcome-node",
        type: "explanation",
        title: "Welcome to Math Adventure!",
        content: "Hi there! I'm Nelie, and I'm excited to go on a math adventure with you. Today we're going to help a baker solve some addition problems!",
        educational: {
          subject: "mathematics",
          skillArea: "addition",
          difficultyLevel: 1,
          estimatedDuration: 2,
          learningObjectives: ["Introduce the scenario", "Set expectations"]
        },
        connections: {
          next: "problem-1"
        },
        config: {
          required: true,
          allowHints: false
        }
      },
      {
        id: "problem-1",
        type: "question",
        title: "The Baker's First Challenge",
        content: "The baker has 3 chocolate cookies and 2 vanilla cookies. How many cookies does the baker have in total?",
        educational: {
          subject: "mathematics",
          skillArea: "addition",
          difficultyLevel: 2,
          estimatedDuration: 3,
          learningObjectives: ["Practice basic addition", "Apply math to real scenarios"]
        },
        connections: {
          branches: [
            {
              condition: "correct",
              targetNodeId: "problem-2",
              reason: "Great job! Let's try another problem."
            },
            {
              condition: "incorrect",
              targetNodeId: "hint-1",
              reason: "Let me give you a hint to help you solve this."
            }
          ],
          fallback: "hint-1"
        },
        config: {
          required: true,
          maxAttempts: 3,
          allowHints: true,
          customProperties: {
            options: ["4", "5", "6", "7"],
            correctAnswer: "5",
            questionType: "multiple_choice"
          }
        }
      },
      {
        id: "hint-1",
        type: "explanation",
        title: "Let's Think About This Together",
        content: "When we want to find the total, we add the numbers together. Try counting: 3 cookies + 2 cookies. You can count on your fingers: 1, 2, 3... then 4, 5!",
        educational: {
          subject: "mathematics",
          skillArea: "addition",
          difficultyLevel: 1,
          estimatedDuration: 2,
          learningObjectives: ["Provide scaffolding", "Reinforce counting strategy"]
        },
        connections: {
          next: "problem-1"
        },
        config: {
          required: false,
          allowHints: false
        }
      },
      {
        id: "problem-2",
        type: "question",
        title: "More Cookies to Count!",
        content: "Excellent! Now the baker makes 4 more cookies. If the baker had 5 cookies before and makes 4 more, how many cookies are there now?",
        educational: {
          subject: "mathematics",
          skillArea: "addition",
          difficultyLevel: 3,
          estimatedDuration: 4,
          learningObjectives: ["Practice larger addition", "Build on previous success"]
        },
        connections: {
          branches: [
            {
              condition: "correct",
              targetNodeId: "celebration",
              reason: "Amazing work! You're a math superstar!"
            },
            {
              condition: "incorrect",
              targetNodeId: "hint-2",
              reason: "Let's work through this step by step."
            }
          ],
          fallback: "hint-2"
        },
        config: {
          required: true,
          maxAttempts: 3,
          allowHints: true,
          customProperties: {
            options: ["8", "9", "10", "11"],
            correctAnswer: "9",
            questionType: "multiple_choice"
          }
        }
      },
      {
        id: "hint-2",
        type: "explanation",
        title: "Let's Break It Down",
        content: "We had 5 cookies, and we're adding 4 more. Try counting from 5: 6, 7, 8, 9! So 5 + 4 = 9.",
        educational: {
          subject: "mathematics",
          skillArea: "addition",
          difficultyLevel: 2,
          estimatedDuration: 2,
          learningObjectives: ["Teach counting on strategy", "Support problem solving"]
        },
        connections: {
          next: "problem-2"
        },
        config: {
          required: false,
          allowHints: false
        }
      },
      {
        id: "celebration",
        type: "summary",
        title: "Congratulations, Math Hero!",
        content: "You did an amazing job helping the baker with addition! You learned how to add small numbers together and used counting strategies. The baker is so happy with your help!",
        educational: {
          subject: "mathematics",
          skillArea: "addition",
          difficultyLevel: 1,
          estimatedDuration: 2,
          learningObjectives: ["Celebrate success", "Reinforce learning", "Build confidence"]
        },
        connections: {},
        config: {
          required: true,
          allowHints: false
        }
      }
    ],
    entryNodeId: "welcome-node",
    exitNodeIds: ["celebration"],
    config: {
      allowRevisit: false,
      autoSave: true,
      maxDuration: 20,
      passingCriteria: {
        minScore: 70,
        requiredNodes: ["problem-1", "problem-2"]
      }
    },
    metadata: {
      author: "Nelie AI Tutor",
      createdAt: new Date(),
      updatedAt: new Date(),
      version: "1.0.0",
      status: "published",
      tags: ["math", "addition", "elementary", "interactive"],
      usage: {
        timesUsed: 0,
        avgCompletionRate: 0,
        avgRating: 5
      }
    }
  };

  const handleStartScenario = () => {
    console.log('🎭 Starting test scenario...');
    setCurrentScenario(testScenario);
  };

  const handleScenarioComplete = () => {
    console.log('🎉 Scenario completed!');
    setCurrentScenario(null);
  };

  const handleScenarioExit = () => {
    console.log('🚪 Exiting scenario...');
    setCurrentScenario(null);
  };

  if (currentScenario) {
    return (
      <div className="min-h-screen bg-gray-900">
        <ScenarioPlayer
          scenario={currentScenario}
          onComplete={handleScenarioComplete}
          onExit={handleScenarioExit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={handleBack} variant="outline" className="border-gray-600 text-slate-950 bg-zinc-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Scenario Engine - Test Environment</h1>
          </div>
        </div>

        {/* Test Environment Info */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-purple-400" />
              Scenario Engine Testing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              This page is for testing the Scenario Engine functionality. You can run interactive learning scenarios here.
            </p>
            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
              <p className="text-purple-300 text-sm">
                <strong>Test Scenario:</strong> Basic Addition Adventure - A simple math scenario with 
                interactive questions, hints, and branching logic.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Scenario */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Sample Scenario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{testScenario.title}</h3>
                <p className="text-gray-300 mb-4">{testScenario.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-4">
                  <div>Subject: {testScenario.educational.subject}</div>
                  <div>Grade Level: {testScenario.educational.gradeLevel}</div>
                  <div>Difficulty: {testScenario.educational.difficulty}/10</div>
                  <div>Duration: ~{testScenario.educational.estimatedDuration} mins</div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Learning Outcomes:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {testScenario.educational.learningOutcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Button
                onClick={handleStartScenario}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Scenario
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimulationsPage;
