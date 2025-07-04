
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, Target, Clock, Users, Lightbulb } from 'lucide-react';
import CurriculumIntegrationService from '@/services/curriculum/CurriculumIntegrationService';
import EnhancedContentGenerationService from '@/services/content/EnhancedContentGenerationService';

const CurriculumDemo = () => {
  const [selectedGrade, setSelectedGrade] = useState<number>(4);
  const [availableTopics, setAvailableTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [curriculumQuery, setCurriculumQuery] = useState<any>(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  useEffect(() => {
    loadTopicsForGrade(selectedGrade);
  }, [selectedGrade]);

  const loadTopicsForGrade = (grade: number) => {
    const topics = CurriculumIntegrationService.getTopicsForGrade(grade);
    setAvailableTopics(topics);
    setSelectedTopic(null);
    setCurriculumQuery(null);
  };

  const handleTopicSelect = (topic: any) => {
    setSelectedTopic(topic);
    const query = CurriculumIntegrationService.getFullCurriculumQuery(topic.id);
    setCurriculumQuery(query);
  };

  const generateSampleContent = async () => {
    if (!selectedTopic) return;
    
    setIsGeneratingContent(true);
    try {
      const scenario = await EnhancedContentGenerationService.generateRealWorldScenario(
        selectedTopic.id, 
        selectedGrade
      );
      console.log('Generated scenario:', scenario);
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          🎓 Integrated Math Curriculum Demo
        </h1>
        <p className="text-gray-300">
          Explore our indexed StudyPug curriculum with AI-enhanced content generation
        </p>
      </div>

      {/* Grade Selection */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Select Grade Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {[3, 4, 5, 6].map(grade => (
              <Button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                variant={selectedGrade === grade ? "default" : "outline"}
                className={selectedGrade === grade ? "bg-blue-600" : "border-gray-600 text-gray-300"}
              >
                Grade {grade}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Topics */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Grade {selectedGrade} Math Topics ({availableTopics.length} available)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableTopics.map(topic => (
              <div
                key={topic.id}
                onClick={() => handleTopicSelect(topic)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedTopic?.id === topic.id
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                }`}
              >
                <h3 className="text-white font-medium mb-2">{topic.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{topic.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {topic.estimatedTime}min
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <Target className="w-3 h-3 mr-1" />
                    Level {topic.difficulty}
                  </Badge>
                  {topic.standards.map((standard: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {standard}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Topic Details */}
      {curriculumQuery && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Curriculum Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Real-World Applications</h4>
                <div className="space-y-1">
                  {curriculumQuery.topic.realWorldApplications.map((app: string, idx: number) => (
                    <div key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      {app}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Cross-Subject Connections</h4>
                <div className="flex gap-2 flex-wrap">
                  {curriculumQuery.topic.crossSubjectConnections.map((subject: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Learning Prerequisites</h4>
                {curriculumQuery.prerequisites.length > 0 ? (
                  <div className="space-y-1">
                    {curriculumQuery.prerequisites.map((prereq: any, idx: number) => (
                      <div key={idx} className="text-gray-300 text-sm">
                        • {prereq.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No prerequisites required</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                AI Content Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Cognitive Level</h4>
                <Badge variant="default" className="capitalize">
                  {curriculumQuery.topic.cognitiveLevel}
                </Badge>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Assessment Strategies</h4>
                <div className="space-y-1">
                  {curriculumQuery.topic.assessmentStrategies.slice(0, 3).map((strategy: string, idx: number) => (
                    <div key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      {strategy}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={generateSampleContent}
                  disabled={isGeneratingContent}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isGeneratingContent ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate AI Content
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CurriculumDemo;
