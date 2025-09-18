import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Library, Search, Filter, Star, BookOpen, Clock, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TeacherSidebar from '@/components/teacher/TeacherSidebar';

const TeacherLibrary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const templates = [
    {
      id: 1,
      title: "Multiplication Tables Lesson",
      type: "Lesson Plan",
      subject: "Mathematics",
      grade: "Grade 3-4",
      version: "v2.1",
      approved: true,
      lastModified: "2 days ago",
      description: "Interactive multiplication lesson with visual aids and games",
      tags: ["multiplication", "interactive", "visual-learning"],
      uses: 45
    },
    {
      id: 2,
      title: "Photosynthesis Lab Activity",
      type: "Lab Activity",
      subject: "Science",
      grade: "Grade 5-6",
      version: "v1.3",
      approved: true,
      lastModified: "1 week ago",
      description: "Hands-on experiment demonstrating photosynthesis process",
      tags: ["biology", "experiment", "hands-on"],
      uses: 32
    },
    {
      id: 3,
      title: "Creative Writing Workshop",
      type: "Worksheet",
      subject: "English",
      grade: "Grade 4-5",
      version: "v1.0",
      approved: false,
      lastModified: "3 days ago",
      description: "Story prompts and structure exercises for creative writing",
      tags: ["writing", "creativity", "storytelling"],
      uses: 12
    }
  ];

  const facets = [
    { name: 'All', count: 156 },
    { name: 'Lesson Plans', count: 45 },
    { name: 'Worksheets', count: 62 },
    { name: 'Lab Activities', count: 28 },
    { name: 'Assessments', count: 21 }
  ];

  return (
    <div className="h-[100dvh] bg-slate-900 flex">
      <TeacherSidebar showBackButton={false} />

      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="h-20 bg-slate-850 border-b border-slate-700 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white flex items-center">
              <Library className="w-6 h-6 mr-3 text-green-400" />
              Template Library
            </h1>
            <p className="text-sm text-slate-400">Browse and manage lesson templates with versioning</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600">
              <Star className="w-4 h-4 mr-2" />
              My Favorites
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-5rem)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Search Facets */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800 border-slate-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Search Facets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {facets.map((facet) => (
                    <button
                      key={facet.name}
                      className={`w-full text-left p-2 rounded transition-colors ${
                        selectedFilter === facet.name 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'text-slate-300 hover:bg-slate-700/50'
                      }`}
                      onClick={() => setSelectedFilter(facet.name)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{facet.name}</span>
                        <Badge variant="outline" className="text-xs border-slate-600">
                          {facet.count}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Total Templates</p>
                      <p className="text-lg font-semibold text-white">156</p>
                    </div>
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Approved</p>
                      <p className="text-lg font-semibold text-green-400">142</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">My Templates</p>
                      <p className="text-lg font-semibold text-blue-400">23</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Templates List */}
            <div className="lg:col-span-3">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400"
                  />
                </div>
                <select className="bg-slate-700 border border-slate-600 text-slate-200 rounded-md px-3 py-2 text-sm">
                  <option>Sort by: Most Used</option>
                  <option>Sort by: Newest</option>
                  <option>Sort by: Highest Rated</option>
                </select>
              </div>

              <div className="space-y-4">
                {templates.map((template) => (
                  <Card key={template.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{template.title}</h3>
                            {template.approved && (
                              <Badge className="bg-green-500 text-white text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Approved
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-slate-300 border-slate-600 text-xs">
                              {template.version}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 mb-3">
                            <Badge variant="outline" className="text-slate-300 border-slate-600">
                              {template.type}
                            </Badge>
                            <span className="text-sm text-slate-400">{template.subject}</span>
                            <span className="text-sm text-slate-400">{template.grade}</span>
                          </div>
                          
                          <p className="text-sm text-slate-300 mb-3">{template.description}</p>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <Tag className="w-3 h-3 text-slate-400" />
                            {template.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className="p-3 bg-slate-700/50 rounded-lg">
                            <p className="text-xs text-slate-400 mb-1">Used</p>
                            <p className="text-lg font-semibold text-blue-400">{template.uses}</p>
                            <p className="text-xs text-slate-400">times</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>Modified {template.lastModified}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600">
                            Preview
                          </Button>
                          <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600">
                            Favorite
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLibrary;