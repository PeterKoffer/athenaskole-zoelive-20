
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Lock, 
  Users, 
  GraduationCap, 
  Calendar,
  Target,
  BookOpen,
  Brain,
  User,
  Shield,
  School,
  ArrowRight,
  FileText,
  Globe
} from 'lucide-react';

interface PageInfo {
  name: string;
  route: string;
  component: string;
  authRequired: boolean;
  requiredRole?: string;
  description: string;
  icon: React.ElementType;
  connectedTo: string[];
  status: 'active' | 'broken' | 'redirect';
}

const SiteMap = () => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  const pages: PageInfo[] = [
    {
      name: 'Home/Landing',
      route: '/',
      component: 'Index.tsx',
      authRequired: false,
      description: 'Main landing page with hero section and navigation',
      icon: Home,
      connectedTo: ['/auth', '/daily-program'],
      status: 'active'
    },
    {
      name: 'Authentication',
      route: '/auth',
      component: 'Auth.tsx',
      authRequired: false,
      description: 'Role selection and login/signup forms',
      icon: Lock,
      connectedTo: ['/daily-program', '/school-dashboard', '/profile'],
      status: 'active'
    },
    {
      name: 'Daily Program',
      route: '/daily-program',
      component: 'DailyProgramPage.tsx',
      authRequired: true,
      description: 'AI-generated learning universe entry point',
      icon: Calendar,
      connectedTo: ['/daily-universe', '/training-ground'],
      status: 'active'
    },
    {
      name: 'Daily Universe',
      route: '/daily-universe',
      component: 'DailyUniversePage.tsx',
      authRequired: true,
      description: 'Interactive AI learning environment',
      icon: Globe,
      connectedTo: [],
      status: 'active'
    },
    {
      name: 'Training Ground',
      route: '/training-ground',
      component: 'TrainingGround.tsx',
      authRequired: true,
      description: 'Subject-specific focused learning activities',
      icon: Target,
      connectedTo: ['/learn/:activityId'],
      status: 'active'
    },
    {
      name: 'School Dashboard',
      route: '/school-dashboard',
      component: 'SchoolDashboard.tsx',
      authRequired: true,
      requiredRole: 'school_leader',
      description: 'Management dashboard for school leaders',
      icon: School,
      connectedTo: [],
      status: 'active'
    },
    {
      name: 'Profile',
      route: '/profile',
      component: 'ProfilePage.tsx',
      authRequired: true,
      description: 'User profile and settings',
      icon: User,
      connectedTo: ['/auth'],
      status: 'active'
    },
    {
      name: 'Today\'s Program (Legacy)',
      route: '/todays-program',
      component: 'TodaysProgram.tsx',
      authRequired: false,
      description: 'Redirects to DailyProgramPage - should be removed',
      icon: FileText,
      connectedTo: ['/daily-program'],
      status: 'redirect'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'broken': return 'bg-red-500';
      case 'redirect': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500';
      case 'school_leader': return 'bg-blue-500';
      case 'teacher': return 'bg-green-500';
      case 'student': return 'bg-orange-500';
      case 'parent': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Application Site Map</h1>
          <p className="text-gray-300">
            Complete overview of all pages, routes, and their relationships in the application
          </p>
        </div>

        {/* Legend */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-white font-medium mb-2">Page Status</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-300 text-sm">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-300 text-sm">Broken</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-300 text-sm">Redirect</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Authentication</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-red-400" />
                    <span className="text-gray-300 text-sm">Auth Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">Public</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Role Requirements</h4>
                <div className="space-y-1">
                  <Badge className="bg-blue-500 text-white">school_leader</Badge>
                  <Badge className="bg-purple-500 text-white">admin</Badge>
                  <Badge className="bg-green-500 text-white">teacher</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => {
            const IconComponent = page.icon;
            const isSelected = selectedPage === page.route;
            
            return (
              <Card 
                key={page.route}
                className={`bg-gray-800 border-gray-700 cursor-pointer transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-blue-500 transform scale-105' : 'hover:bg-gray-750'
                }`}
                onClick={() => setSelectedPage(isSelected ? null : page.route)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-6 h-6 text-blue-400" />
                      <div>
                        <CardTitle className="text-white text-lg">{page.name}</CardTitle>
                        <code className="text-xs text-gray-400">{page.route}</code>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(page.status)}`}></div>
                      {page.authRequired ? (
                        <Lock className="w-4 h-4 text-red-400" />
                      ) : (
                        <Globe className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-3">{page.description}</p>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">
                      Component: <code className="text-blue-300">{page.component}</code>
                    </div>
                    
                    {page.requiredRole && (
                      <Badge className={`${getRoleColor(page.requiredRole)} text-white text-xs`}>
                        {page.requiredRole}
                      </Badge>
                    )}
                    
                    {page.connectedTo.length > 0 && (
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Connects to:</div>
                        <div className="flex flex-wrap gap-1">
                          {page.connectedTo.map((connection) => (
                            <Badge key={connection} variant="outline" className="text-xs">
                              {connection}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Analysis Section */}
        <Card className="mt-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Structure Analysis & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-yellow-400" />
                  Issues Identified
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Legacy redirect page (TodaysProgram.tsx) should be removed</li>
                  <li>• Inconsistent naming: "Daily Program" vs "Today's Program"</li>
                  <li>• Missing role-specific dashboards (teacher, parent, admin)</li>
                  <li>• No clear user onboarding flow</li>
                  <li>• Limited navigation structure between learning modules</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Suggested Improvements
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Remove TodaysProgram.tsx redirect component</li>
                  <li>• Create missing dashboard pages for all user roles</li>
                  <li>• Implement consistent navigation hierarchy</li>
                  <li>• Add breadcrumb navigation system</li>
                  <li>• Create a proper onboarding sequence</li>
                  <li>• Standardize page naming conventions</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <h4 className="text-white font-medium mb-2">Current Navigation Flow</h4>
              <div className="flex items-center gap-2 text-sm text-gray-300 flex-wrap">
                <span>Home</span>
                <ArrowRight className="w-4 h-4" />
                <span>Auth (Role Selection)</span>
                <ArrowRight className="w-4 h-4" />
                <span>Daily Program</span>
                <ArrowRight className="w-4 h-4" />
                <span>Learning Modules</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            Refresh Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SiteMap;
