import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGradeLevelContent } from '@/hooks/useGradeLevelContent';
import { commonStandardsAPI } from '@/services/commonStandardsAPI';
import { dailyLearningSessionOrchestrator } from '@/services/dailyLearningSessionOrchestrator';
import { ContentDeduplicationService } from '@/services/contentDeduplicationService';
import { useAuth } from '@/hooks/useAuth';
import { GraduationCap, Target, BookOpen, Play, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';

interface GradeAwareContentGeneratorProps {
  subject: string;
  skillArea: string;
  onContentGenerated: (contentConfig: any) => void;
}

const GradeAwareContentGenerator = ({ 
  subject, 
  skillArea, 
  onContentGenerated 
}: GradeAwareContentGeneratorProps) => {
  const { user } = useAuth();
  const { gradeConfig, loading, getStandardForSkillArea } = useGradeLevelContent(subject);
  const [selectedStandard, setSelectedStandard] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [contentMetrics, setContentMetrics] = useState<any>(null);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const initializePersonalizedSession = async () => {
      if (user?.id && gradeConfig && !isGenerating && !error && retryCount === 0) {
        // Load current daily session and content metrics
        await loadPersonalizedData();
        
        // Auto-generate content after a short delay
        const timer = setTimeout(() => {
          generatePersonalizedContent();
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    };

    initializePersonalizedSession();
  }, [gradeConfig, skillArea, retryCount, user?.id]);

  const loadPersonalizedData = async () => {
    if (!user?.id || !gradeConfig) return;

    try {
      // Get current daily session
      const today = new Date().toISOString().split('T')[0];
      const sessionData = await dailyLearningSessionOrchestrator.getCurrentLearningActivity(user.id, today);
      setCurrentSession(sessionData);

      // Get content metrics for this subject/skill area
      const metrics = await dailyLearningSessionOrchestrator.getContentMetrics(
        user.id, 
        subject, 
        skillArea
      );
      setContentMetrics(metrics);
      setPersonalizedRecommendations(metrics.recommendations);

    } catch (error) {
      console.error('Error loading personalized data:', error);
    }
  };

  const generatePersonalizedContent = async () => {
    if (!gradeConfig) {
      setError('Grade configuration not available');
      return;
    }

    setIsGenerating(true);
    setError(null);
    console.log('🎯 Starting grade-appropriate content generation...');

    try {
      // Check if we have a current daily session
      if (user?.id && !currentSession?.session) {
        // Start a new daily session if none exists
        console.log('🚀 Starting new daily learning session...');
        const newSession = await dailyLearningSessionOrchestrator.startDailySession(
          user.id, 
          gradeConfig.userGrade
        );
        setCurrentSession({ 
          session: newSession, 
          currentActivity: newSession.sessions[0] || null, 
          isComplete: false 
        });
      }

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Content generation timeout')), 5000);
      });

      const contentGenerationPromise = new Promise(async (resolve) => {
        // Find the most appropriate standard for the skill area
        const standard = getStandardForSkillArea(skillArea);
        
        if (standard) {
          setSelectedStandard(standard);
        }

        // Check content uniqueness if user is logged in
        let uniquenessScore = 100;
        let diversityRecommendations: string[] = [];
        
        if (user?.id) {
          try {
            const uniquenessCheck = await ContentDeduplicationService.checkContentUniqueness(
              user.id,
              'question',
              `${subject}-${skillArea}-${gradeConfig.userGrade}`,
              subject,
              skillArea,
              gradeConfig.userGrade
            );
            
            uniquenessScore = (1 - uniquenessCheck.similarityScore) * 100;
            if (uniquenessCheck.recommendations) {
              diversityRecommendations = uniquenessCheck.recommendations;
            }
          } catch (error) {
            console.warn('Content uniqueness check failed:', error);
          }
        }
        
        // Generate personalized content configuration
        const contentConfig = {
          gradeLevel: gradeConfig.userGrade,
          standard: standard || {
            code: `GRADE${gradeConfig.userGrade}.${subject.toUpperCase()}`,
            title: `Grade ${gradeConfig.userGrade} ${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
            description: `${skillArea} practice for Grade ${gradeConfig.userGrade}`,
            domain: skillArea
          },
          difficultyRange: gradeConfig.difficultyRange,
          subject: subject,
          skillArea: skillArea,
          prerequisites: gradeConfig.prerequisites.filter(p => 
            standard ? p.domain === standard.domain : true
          ),
          contentPrompt: createGradeSpecificPrompt(
            standard || { 
              code: `GRADE${gradeConfig.userGrade}`, 
              title: `Grade ${gradeConfig.userGrade} Content`,
              description: skillArea 
            }, 
            gradeConfig.userGrade
          ),
          // Enhanced personalization features
          personalization: {
            userId: user?.id,
            uniquenessScore,
            diversityRecommendations,
            contentMetrics: contentMetrics,
            currentSession: currentSession?.currentActivity,
            adaptiveAdjustments: currentSession?.session?.adaptiveAdjustments || []
          }
        };

        console.log('🎯 Generated personalized grade-appropriate content config:', contentConfig);
        resolve(contentConfig);
      });

      const contentConfig = await Promise.race([contentGenerationPromise, timeoutPromise]);
      
      // Simulate minimal processing time, then proceed immediately
      setTimeout(() => {
        onContentGenerated(contentConfig);
        setIsGenerating(false);
      }, 500);

    } catch (error) {
      console.error('❌ Content generation failed:', error);
      setError('Failed to generate content. Please try again.');
      setIsGenerating(false);
      setRetryCount(prev => prev + 1);
    }
  };

  const createGradeSpecificPrompt = (standard: any, grade: number): string => {
    const gradeDescriptors = {
      1: "very simple, concrete concepts with visual examples",
      2: "basic concepts with clear, simple language",
      3: "foundational skills with some abstract thinking",
      4: "intermediate concepts with problem-solving",
      5: "more complex ideas with real-world applications",
      6: "middle school level with analytical thinking",
      7: "pre-algebra concepts with logical reasoning",
      8: "advanced middle school with abstract concepts",
      9: "high school foundation with critical thinking",
      10: "intermediate high school with complex analysis",
      11: "advanced high school with synthesis skills",
      12: "college-prep level with sophisticated reasoning"
    };

    return `Create content for Grade ${grade} (${gradeDescriptors[grade as keyof typeof gradeDescriptors]}) 
aligned with ${standard.code}: ${standard.title}. 
Focus on: ${standard.description}
Use age-appropriate language, examples, and difficulty level.
Ensure content builds on previous grade knowledge and prepares for next grade concepts.`;
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    generatePersonalizedContent();
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <GraduationCap className="w-8 h-8 text-lime-400 animate-pulse mx-auto mb-4" />
          <p className="text-white">Loading grade-appropriate content...</p>
        </CardContent>
      </Card>
    );
  }

  if (!gradeConfig) {
    return (
      <Card className="bg-red-900 border-red-700">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <p className="text-white">Unable to determine appropriate grade level</p>
          <Button 
            onClick={handleRetry}
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Retry Setup
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900 border-red-700">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <p className="text-white mb-4">{error}</p>
          <Button 
            onClick={handleRetry}
            className="bg-red-600 hover:bg-red-700"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <GraduationCap className="w-5 h-5 text-lime-400" />
            <span>Grade {gradeConfig.userGrade} - {subject.charAt(0).toUpperCase() + subject.slice(1)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-600 text-white border-blue-600">
              Difficulty: {gradeConfig.difficultyRange[0]}-{gradeConfig.difficultyRange[1]}
            </Badge>
            <Badge variant="outline" className="bg-green-600 text-white border-green-600">
              Standards-Aligned
            </Badge>
            {user?.id && (
              <Badge variant="outline" className="bg-purple-600 text-white border-purple-600">
                <Sparkles className="w-3 h-3 mr-1" />
                Personalized
              </Badge>
            )}
          </div>

          {/* Personalization Metrics */}
          {user?.id && contentMetrics && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-purple-400 mt-1" />
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-2">Personalization Status</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Content Freshness</p>
                      <p className="text-white font-medium">{Math.round(contentMetrics.freshness)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Diversity Score</p>
                      <p className="text-white font-medium">{Math.round(contentMetrics.diversity)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Uniqueness</p>
                      <p className="text-white font-medium">{Math.round(contentMetrics.uniqueness)}%</p>
                    </div>
                  </div>
                  {personalizedRecommendations.length > 0 && (
                    <div className="mt-3">
                      <p className="text-gray-400 text-xs mb-1">Recommendations:</p>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {personalizedRecommendations.slice(0, 2).map((rec, index) => (
                          <li key={index} className="flex items-start space-x-1">
                            <span className="text-purple-400">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Current Session Info */}
          {currentSession?.currentActivity && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Play className="w-5 h-5 text-lime-400 mt-1" />
                <div className="flex-1">
                  <h4 className="text-white font-medium">Current Learning Session</h4>
                  <p className="text-gray-300 text-sm">
                    {currentSession.currentActivity.subject} - {currentSession.currentActivity.skillArea}
                  </p>
                  <p className="text-gray-400 text-xs">
                    Session {(currentSession.session?.currentSessionIndex || 0) + 1} of {currentSession.session?.sessions.length || 0}
                  </p>
                  {currentSession.session?.progress && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{currentSession.session.progress.completedSessions}/{currentSession.session.progress.totalSessions}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-lime-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(currentSession.session.progress.completedSessions / currentSession.session.progress.totalSessions) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedStandard && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-lime-400 mt-1" />
                <div>
                  <h4 className="text-white font-medium">{selectedStandard.code}</h4>
                  <p className="text-gray-300 text-sm">{selectedStandard.title}</p>
                  <p className="text-gray-400 text-xs mt-1">{selectedStandard.description}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h5 className="text-white font-medium flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-lime-400" />
              <span>Available Skill Areas for Grade {gradeConfig.userGrade}</span>
            </h5>
            <div className="flex flex-wrap gap-2">
              {gradeConfig.skillAreas.map((area, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className={`text-xs ${
                    area === skillArea 
                      ? 'bg-lime-600 text-white border-lime-600' 
                      : 'text-gray-300 border-gray-600'
                  }`}
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          {isGenerating && (
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Play className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-blue-200 text-sm font-medium">Generating Grade {gradeConfig.userGrade} Content...</span>
              </div>
              <p className="text-blue-300 text-xs">Creating personalized questions for your skill level</p>
              <div className="mt-3">
                <Button 
                  onClick={handleRetry}
                  variant="outline"
                  size="sm"
                  className="text-blue-300 border-blue-600 hover:bg-blue-800"
                >
                  Skip Wait & Continue
                </Button>
              </div>
            </div>
          )}

          {!isGenerating && !selectedStandard && !error && (
            <Button 
              onClick={generatePersonalizedContent}
              className="w-full bg-lime-600 hover:bg-lime-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Learning Session
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeAwareContentGenerator;
