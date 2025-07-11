
import React, { useState, useEffect } from 'react';
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { curriculumService } from '@/services/curriculum/CurriculumService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  BookOpen, 
  GraduationCap, 
  Globe, 
  Search, 
  Filter, 
  ChevronRight,
  BarChart3 
} from 'lucide-react';

const CurriculumDashboard: React.FC = () => {
  const [nodes, setNodes] = useState<CurriculumNode[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<CurriculumNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedNodeType, setSelectedNodeType] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [nodes, searchTerm, selectedCountry, selectedNodeType, selectedSubject]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allNodes, curriculumStats] = await Promise.all([
        curriculumService.getNodes(),
        curriculumService.getStats()
      ]);
      setNodes(allNodes);
      setStats(curriculumStats);
    } catch (error) {
      console.error('Error loading curriculum data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    const filters: any = {};
    
    if (selectedCountry) filters.countryCode = selectedCountry;
    if (selectedNodeType) filters.nodeType = selectedNodeType;
    if (selectedSubject) filters.subjectName = selectedSubject;
    if (searchTerm) filters.nameContains = searchTerm;

    const filtered = await curriculumService.getNodes(filters);
    setFilteredNodes(filtered);
  };

  const getUniqueValues = (field: keyof CurriculumNode) => {
    return [...new Set(nodes.map(node => node[field]).filter(Boolean))];
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedNodeType('');
    setSelectedSubject('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading curriculum data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNodes}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.nodesByCountry).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.nodesBySubject).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Node Types</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.nodesByType).length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter and search through the curriculum data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search curriculum nodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Countries</SelectItem>
                {getUniqueValues('countryCode').map((country) => (
                  <SelectItem key={country} value={country as string}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedNodeType} onValueChange={setSelectedNodeType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {getUniqueValues('nodeType').map((type) => (
                  <SelectItem key={type} value={type as string}>
                    {type?.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {getUniqueValues('subjectName').map((subject) => (
                  <SelectItem key={subject} value={subject as string}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={clearFilters} variant="outline">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Curriculum Nodes ({filteredNodes.length} results)</CardTitle>
          <CardDescription>
            Browse and explore the curriculum structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNodes.map((node) => (
              <div key={node.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">
                        {node.nodeType.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {node.countryCode && (
                        <Badge variant="outline">{node.countryCode}</Badge>
                      )}
                      {node.educationalLevel && (
                        <Badge variant="outline">Grade {node.educationalLevel}</Badge>
                      )}
                      {node.subjectName && (
                        <Badge variant="outline">{node.subjectName}</Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-1">{node.name}</h3>
                    
                    {node.description && (
                      <p className="text-muted-foreground text-sm mb-2">
                        {node.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>ID: {node.id}</span>
                      {node.estimatedDuration && (
                        <span>{node.estimatedDuration}min</span>
                      )}
                      {node.tags && node.tags.length > 0 && (
                        <span>Tags: {node.tags.join(', ')}</span>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredNodes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No curriculum nodes found matching your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurriculumDashboard;
