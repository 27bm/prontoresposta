
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  User, 
  FileText, 
  Calendar, 
  Smartphone,
  Skull,
  MessageCircle,
  FileEdit,
  Dumbbell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSchedule } from '@/contexts/ScheduleContext';
import { useForumStats } from '@/hooks/useForumStats';

const navItems = [
  { path: 'http://wa.me/555123990766', title: 'BM GPT', icon: Skull, external: true },
  { path: '/suspects', title: 'Suspeitos', icon: User },
  { path: '/documents', title: 'Documentos', icon: FileText },
  { path: '/schedule', title: 'Agenda', icon: Calendar },
  { path: '/release', title: 'Release', icon: FileEdit },
  { path: '/forum', title: 'Fórum', icon: MessageCircle },
  { path: '/shortcuts', title: 'Aplicativos', icon: Smartphone },
  { path: '/taf', title: 'TAF', icon: Dumbbell },
];

export function Navbar() {
  const location = useLocation();
  const { totalWorkedHours } = useSchedule();
  const { unansweredQuestions } = useForumStats();
  
  const handleNavigation = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.external) {
      e.preventDefault();
      window.open(item.path, '_blank');
    }
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-10">
      <div className="flex justify-between w-full max-w-screen-lg mx-auto px-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-2 text-center transition-all relative",
              location.pathname === item.path && !item.external
                ? "text-police-blue font-medium"
                : "text-gray-500 hover:text-police-lightBlue"
            )}
            onClick={(e) => handleNavigation(item, e)}
          >
            <div className="relative">
              <item.icon className="h-5 w-5 mb-1" />
              
              {/* Schedule hours badges - only display worked hours */}
              {item.path === '/schedule' && totalWorkedHours > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 px-1 py-0.25 min-h-[12px] min-w-[12px] text-[10px] bg-green-500 text-white border-none"
                >
                  {totalWorkedHours}
                </Badge>
              )}
              
              {/* Forum unanswered questions badge */}
              {item.path === '/forum' && unansweredQuestions > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 px-1 py-0.25 min-h-[12px] min-w-[12px] text-[10px] bg-yellow-400 text-yellow-950 border-none"
                >
                  {unansweredQuestions}
                </Badge>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
