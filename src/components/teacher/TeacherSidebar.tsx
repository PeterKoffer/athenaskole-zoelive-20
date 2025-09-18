import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, BarChart3, BookOpen, Users, Brain, Clock, Calendar, Scale, 
  FileText, Library, Map, MessageSquare, Shield, ClipboardCheck 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TeacherSidebarProps {
  showBackButton?: boolean;
}

const TeacherSidebar = ({ showBackButton = true }: TeacherSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      icon: BarChart3,
      path: '/teacher-dashboard',
      label: 'Dashboard'
    },
    {
      icon: BookOpen,
      path: '/teacher-dashboard/classes',
      label: 'My Classes'
    },
    {
      icon: Users,
      path: '/teacher-dashboard/progress',
      label: 'Student Progress'
    },
    {
      icon: Scale,
      path: '/teacher-dashboard/subject-weighting',
      label: 'Subject Weighting'
    },
    {
      icon: Brain,
      path: '/teacher-dashboard/ai-preferences',
      label: 'AI Preferences'
    },
    {
      icon: Clock,
      path: '/teacher-dashboard/duration',
      label: 'Lesson Duration'
    },
    {
      icon: Calendar,
      path: '/teacher-dashboard/calendar',
      label: 'Calendar'
    },
    {
      icon: ClipboardCheck,
      path: '/teacher-dashboard/assignments',
      label: 'Assignments & Assessment'
    },
    {
      icon: Library,
      path: '/teacher-dashboard/library',
      label: 'Library'
    },
    {
      icon: Map,
      path: '/teacher-dashboard/curriculum-map',
      label: 'Curriculum Map'
    },
    {
      icon: MessageSquare,
      path: '/teacher-dashboard/communication',
      label: 'Communication'
    },
    {
      icon: Shield,
      path: '/teacher-dashboard/accessibility',
      label: 'Accessibility'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/teacher-dashboard') {
      return location.pathname === '/teacher-dashboard';
    }
    return location.pathname === path;
  };

  return (
    <div className="w-20 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-6">
      {showBackButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/training-ground')}
          className="text-slate-400 hover:text-white hover:bg-slate-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      )}
      
      <div className="flex flex-col space-y-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-2">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        
        <div className="w-8 h-0.5 bg-slate-600 rounded-full"></div>
        
        {/* Navigation Icons */}
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="icon"
              className={`relative group transition-all duration-200 ${
                active 
                  ? 'text-white bg-slate-700 shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="w-5 h-5" />
              {active && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-l-full"></div>
              )}
              
              {/* Tooltip */}
              <div className="absolute left-16 px-2 py-1 bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                {item.label}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherSidebar;