import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Plus, Search, Filter, Calendar, FileText, BarChart3, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TeacherSidebar from '@/components/teacher/TeacherSidebar';

const TeacherAssignments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const assignments = [
    {
      id: 1,
      title: "Fractions Quiz",
      type: "Quiz",
      subject: "Math",
      class: "Math 6A",
      dueDate: "Sept 22, 2023",
      status: "Active",
      submitted: 18,
      total: 24,
      avgScore: 87
    },
    {
      id: 2,
      title: "Cell Structure Lab Report",
      type: "Lab Report",
      subject: "Science",
      class: "Science 5B", 
      dueDate: "Sept 25, 2023",
      status: "Draft",
      submitted: 0,
      total: 22,
      avgScore: null
    },
    {
      id: 3,
      title: "Reading Comprehension",
      type: "Worksheet",
      subject: "English",
      class: "English 4A",
      dueDate: "Sept 20, 2023",
      status: "Grading",
      submitted: 26,
      total: 26,
      avgScore: 92
    }
  ];

  const generators = [
    { name: 'Quiz Generator', icon: FileText, description: 'Auto-generate quizzes from content' },
    { name: 'Worksheet Builder', icon: ClipboardCheck, description: 'Create custom worksheets' },
    { name: 'Rubric Designer', icon: BarChart3, description: 'Build assessment rubrics' },
    { name: 'Auto-Differentiate', icon: Brain, description: 'Adapt for different levels' }
  ];

  return (
    <div className="h-[100dvh] bg-slate-900 flex">
      <TeacherSidebar showBackButton={false} />

      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="h-20 bg-slate-850 border-b border-slate-700 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white flex items-center">
              <ClipboardCheck className="w-6 h-6 mr-3 text-blue-400" />
              Assignments & Assessment
            </h1>
            <p className="text-sm text-slate-400">Create, manage, and grade assignments with AI assistance</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Assignment
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-5rem)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Generator Wizards */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800 border-slate-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Generator Wizards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {generators.map((generator) => (
                    <Button
                      key={generator.name}
                      variant="outline"
                      className="w-full justify-start bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 h-auto p-3"
                    >
                      <generator.icon className="w-4 h-4 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">{generator.name}</p>
                        <p className="text-xs text-slate-400">{generator.description}</p>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Active</p>
                      <p className="text-lg font-semibold text-green-400">12</p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Grading</p>
                      <p className="text-lg font-semibold text-yellow-400">5</p>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Avg Class Score</p>
                    <p className="text-lg font-semibold text-blue-400">89%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assignments List */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search assignments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400"
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-slate-200 rounded-md px-3 py-2 text-sm"
                >
                  <option value="All">All Assignments</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Grading">Grading</option>
                </select>
              </div>

              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <Card key={assignment.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{assignment.title}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge variant="outline" className="text-slate-300 border-slate-600">
                              {assignment.type}
                            </Badge>
                            <span className="text-sm text-slate-400">{assignment.class}</span>
                            <span className="text-sm text-slate-400">Due: {assignment.dueDate}</span>
                          </div>
                        </div>
                        <Badge className={`
                          ${assignment.status === 'Active' ? 'bg-green-500' : 
                            assignment.status === 'Draft' ? 'bg-gray-500' :
                            assignment.status === 'Grading' ? 'bg-yellow-500' : 'bg-blue-500'}
                          text-white
                        `}>
                          {assignment.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                          <p className="text-xs text-slate-400 mb-1">Submitted</p>
                          <p className="text-sm font-medium text-slate-200">
                            {assignment.submitted}/{assignment.total}
                          </p>
                          <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                          <p className="text-xs text-slate-400 mb-1">Avg Score</p>
                          <p className="text-sm font-medium text-slate-200">
                            {assignment.avgScore ? `${assignment.avgScore}%` : 'N/A'}
                          </p>
                        </div>
                        
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                          <p className="text-xs text-slate-400 mb-1">Subject</p>
                          <p className="text-sm font-medium text-slate-200">{assignment.subject}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600">
                          Edit
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          View Details
                        </Button>
                        {assignment.status === 'Grading' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            Grade Queue
                          </Button>
                        )}
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

export default TeacherAssignments;