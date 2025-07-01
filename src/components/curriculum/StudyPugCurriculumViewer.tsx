
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Award, ArrowRight, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurriculumIntegrationService } from '@/services/curriculum/curriculumIntegration';
import { completeStudyPugCurriculum, CurriculumLevel, CurriculumTopic } from '@/services/curriculum/studyPugCurriculum';

interface StudyPugCurriculumViewerProps {
  selectedGrade?: number | string;
  completedTopics?: string[];
  onTopicSelect?: (topic: CurriculumTopic) => void;
}

const StudyPugCurriculumViewer = ({ 
  selectedGrade = 4, 
  completedTopics = [],
  onTopicSelect 
}: StudyPugCurriculumViewerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<CurriculumLevel | null>(null);
  const [filteredTopics, setFilteredTopics] = useState<CurriculumTopic[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  useEffect(() => {
    if (searchTerm) {
      const searchResults = CurriculumIntegrationService.searchTopics(searchTerm);
      setFilteredTopics(searchResults);
    } else if (selectedLevel) {
      const topics = CurriculumIntegrationService.getTopicsForGrade(selectedLevel.grade);
      setFilteredTopics(topics);
    } else {
      const topics = CurriculumIntegrationService.getTopicsForGrade(selectedGrade);
      setFilteredTopics(topics);
    }
  }, [searchTerm, selectedLevel, selectedGrade]);

  const stats = CurriculumIntegrationService.getCurriculumStats();
  const recommendedTopics = CurriculumIntegrationService.getNextRecommendedTopics(
    completedTopics, 
    selectedGrade
  );

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'bg-green-500';
    if (difficulty <= 6) return 'bg-yellow-500';
    if (difficulty <= 9) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 3) return 'Beginner';
    if (difficulty <= 6) return 'Intermediate';
    if (difficulty <= 9) return 'Advanced';
    return 'Expert';
  };

  const filteredAndSortedTopics = filteredTopics.filter(topic => {
    if (difficultyFilter === 'all') return true;
    const range = difficultyFilter.split('-').map(Number);
    return topic.difficulty >= range[0] && topic.difficulty <= range[1];
  });

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">StudyPug Common Core Math Curriculum</h2>
              <p className="text-blue-100">Comprehensive K-12 mathematics curriculum aligned with Common Core standards</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalTopics}</div>
              <div className="text-sm text-blue-200">Total Topics</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-xl font-semibold">{stats.totalLevels}</div>
              <div className="text-sm text-blue-200">Grade Levels</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">{stats.totalSubjects}</div>
              <div className="text-sm text-blue-200">Subject Areas</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">{completedTopics.length}</div>
              <div className="text-sm text-blue-200">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search topics, standards, or concepts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="1-3">Beginner (1-3)</SelectItem>
                <SelectItem value="4-6">Intermediate (4-6)</SelectItem>
                <SelectItem value="7-9">Advanced (7-9)</SelectItem>
                <SelectItem value="10-12">Expert (10-12)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grade Level Navigator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Grade Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {completeStudyPugCurriculum.map((level) => {
              const topics = CurriculumIntegrationService.getTopicsForGrade(level.grade);
              const completed = topics.filter(t => completedTopics.includes(t.id)).length;
              const progress = topics.length > 0 ? (completed / topics.length) * 100 : 0;
              
              return (
                <Button
                  key={level.id}
                  variant={selectedLevel?.id === level.id ? "default" : "outline"}
                  onClick={() => setSelectedLevel(level)}
                  className="h-auto p-3 flex flex-col items-center"
                >
                  <div className="font-semibold">
                    {typeof level.grade === 'string' ? level.grade : `Grade ${level.grade === 0 ? 'K' : level.grade}`}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {topics.length} topics
                  </div>
                  <Progress value={progress} className="w-full h-1 mt-1" />
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Topics */}
      {recommendedTopics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Recommended Next Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {recommendedTopics.slice(0, 3).map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => onTopicSelect?.(topic)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{topic.name}</div>
                    <div className="text-sm text-gray-600">{topic.description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={getDifficultyColor(topic.difficulty)}>
                        {getDifficultyLabel(topic.difficulty)}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {topic.estimatedTime}min
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Topic List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {searchTerm ? 'Search Results' : selectedLevel ? `${selectedLevel.name} Topics` : 'All Topics'}
            </span>
            <Badge variant="secondary">{filteredAndSortedTopics.length} topics</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredAndSortedTopics.map((topic) => {
              const isCompleted = completedTopics.includes(topic.id);
              const prerequisitesMet = topic.prerequisites.every(prereq => 
                completedTopics.includes(prereq)
              );
              
              return (
                <div
                  key={topic.id}
                  className={`p-4 border rounded-lg transition-all cursor-pointer ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : prerequisitesMet 
                        ? 'hover:bg-gray-50 border-gray-200' 
                        : 'bg-gray-50 border-gray-100 opacity-60'
                  }`}
                  onClick={() => prerequisitesMet && onTopicSelect?.(topic)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{topic.name}</h3>
                        {isCompleted && (
                          <Badge className="bg-green-500">Completed</Badge>
                        )}
                        {!prerequisitesMet && (
                          <Badge variant="secondary">Prerequisites Required</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{topic.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Badge className={getDifficultyColor(topic.difficulty)}>
                            {getDifficultyLabel(topic.difficulty)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-4 h-4" />
                          {topic.estimatedTime} minutes
                        </div>
                        <div className="text-gray-500">
                          Standards: {topic.standards.join(', ')}
                        </div>
                      </div>
                      
                      {topic.prerequisites.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          Prerequisites: {topic.prerequisites.length} topics required
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPugCurriculumViewer;
