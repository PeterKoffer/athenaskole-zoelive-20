
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, BookOpen, Users, Lightbulb, ArrowRight, Target } from 'lucide-react';
import UNESCOCurriculumService from '@/services/curriculum/UNESCOCurriculumService';

const GlobalCurriculumExplorer = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [crossCountryComparison, setCrossCountryComparison] = useState<any[]>([]);
  const [unescoStandards, setUnescoStandards] = useState<any[]>([]);

  useEffect(() => {
    const standards = UNESCOCurriculumService.getUNESCOStandards();
    setUnescoStandards(standards);
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      const comparison = UNESCOCurriculumService.generateCrossCountryComparison(selectedTopic);
      setCrossCountryComparison(comparison);
    }
  }, [selectedTopic]);

  const countries = UNESCOCurriculumService.getAllCountries();
  const selectedCurriculum = UNESCOCurriculumService.getCountryCurriculum(selectedCountry);

  const getCountryFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
      'US': '🇺🇸',
      'GB': '🇬🇧',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'SG': '🇸🇬'
    };
    return flags[countryCode] || '🌍';
  };

  const getFrameworkColor = (framework: string) => {
    const colors: Record<string, string> = {
      'UNESCO_SDG4': 'bg-blue-500',
      'ISCED': 'bg-green-500',
      'GPE': 'bg-purple-500'
    };
    return colors[framework] || 'bg-gray-500';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Globe className="w-8 h-8 text-blue-400" />
          Global K-12 Curriculum Explorer
        </h1>
        <p className="text-gray-300">
          Explore and compare K-12 curricula from around the world, aligned with UNESCO standards
        </p>
      </div>

      <Tabs defaultValue="country-explorer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="country-explorer" className="text-white">Country Explorer</TabsTrigger>
          <TabsTrigger value="unesco-standards" className="text-white">UNESCO Standards</TabsTrigger>
          <TabsTrigger value="cross-comparison" className="text-white">Cross-Country Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="country-explorer" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Select Education System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Choose a country" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {countries.map(countryCode => {
                    const curriculum = UNESCOCurriculumService.getCountryCurriculum(countryCode);
                    return (
                      <SelectItem key={countryCode} value={countryCode} className="text-white">
                        {getCountryFlag(countryCode)} {curriculum?.countryName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedCurriculum && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    {getCountryFlag(selectedCountry)}
                    {selectedCurriculum.countryName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Education System</h4>
                    <p className="text-gray-300">{selectedCurriculum.educationSystem}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">Grade Levels</h4>
                    <div className="flex gap-1 flex-wrap">
                      {selectedCurriculum.gradeLevels.map(grade => (
                        <Badge key={grade} variant="secondary" className="text-xs">
                          Grade {grade}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">Languages of Instruction</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedCurriculum.languageOfInstruction.map(lang => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Available Subjects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedCurriculum.subjects.map((subject, idx) => (
                      <div key={idx} className="p-3 bg-gray-700 rounded-lg">
                        <h4 className="text-white font-medium">{subject.name}</h4>
                        <p className="text-gray-300 text-sm mb-2">{subject.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {subject.topics.length} topics available
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="unesco-standards" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                UNESCO Education Standards & SDG Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unescoStandards.map(standard => (
                  <div key={standard.id} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-white font-medium">{standard.competency}</h4>
                      <Badge className={`${getFrameworkColor(standard.framework)} text-white text-xs`}>
                        {standard.framework}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3">{standard.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Level:</span>
                        <span className="text-gray-300 text-xs">{standard.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Age Range:</span>
                        <span className="text-gray-300 text-xs">{standard.ageRange} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Domain:</span>
                        <span className="text-gray-300 text-xs">{standard.domain}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <Badge variant="outline" className="text-xs">
                        {standard.globalGoal}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cross-comparison" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Cross-Country Topic Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="text-white text-sm font-medium mb-2 block">
                  Search for a topic to compare across countries:
                </label>
                <input
                  type="text"
                  placeholder="e.g., fractions, multiplication, algebra..."
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>

              {crossCountryComparison.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-white font-medium">
                    Approaches to "{selectedTopic}" across different countries:
                  </h4>
                  {crossCountryComparison.map((comparison, idx) => (
                    <div key={idx} className="p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-white font-medium">{comparison.country}</h5>
                        <Badge variant="secondary" className="text-xs">
                          Grade {comparison.gradeLevel}
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{comparison.approach}</p>
                      <div className="flex gap-2 flex-wrap">
                        {comparison.standards.map((standard: string, stdIdx: number) => (
                          <Badge key={stdIdx} variant="outline" className="text-xs">
                            {standard}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GlobalCurriculumExplorer;
