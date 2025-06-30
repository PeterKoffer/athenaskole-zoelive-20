
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calculator, Beaker, Globe, Music, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EducationHomePage: React.FC = () => {
  const navigate = useNavigate();

  const subjects = [
    { name: 'Mathematics', icon: Calculator, color: 'bg-blue-600 hover:bg-blue-700', path: '/education/math' },
    { name: 'Science', icon: Beaker, color: 'bg-green-600 hover:bg-green-700', path: '/education/science' },
    { name: 'English', icon: BookOpen, color: 'bg-purple-600 hover:bg-purple-700', path: '/education/english' },
    { name: 'Geography', icon: Globe, color: 'bg-teal-600 hover:bg-teal-700', path: '/education/geography' },
    { name: 'Music', icon: Music, color: 'bg-yellow-600 hover:bg-yellow-700', path: '/education/music' },
    { name: 'Arts', icon: Palette, color: 'bg-pink-600 hover:bg-pink-700', path: '/education/arts' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Education Center</h1>
          <p className="text-gray-300 text-lg">
            Explore interactive lessons and activities across all subjects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const IconComponent = subject.icon;
            return (
              <Card key={subject.name} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <IconComponent className="w-6 h-6 mr-2" />
                    {subject.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Interactive lessons and activities for {subject.name.toLowerCase()}
                  </p>
                  <Button 
                    onClick={() => navigate(subject.path)}
                    className={`w-full ${subject.color}`}
                  >
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const EducationPage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<EducationHomePage />} />
      <Route path="/math" element={<div className="p-6 text-white">Mathematics content coming soon...</div>} />
      <Route path="/science" element={<div className="p-6 text-white">Science content coming soon...</div>} />
      <Route path="/english" element={<div className="p-6 text-white">English content coming soon...</div>} />
      <Route path="/geography" element={<div className="p-6 text-white">Geography content coming soon...</div>} />
      <Route path="/music" element={<div className="p-6 text-white">Music content coming soon...</div>} />
      <Route path="/arts" element={<div className="p-6 text-white">Arts content coming soon...</div>} />
    </Routes>
  );
};

export default EducationPage;
