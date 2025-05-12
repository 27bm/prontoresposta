
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  User, 
  FileText, 
  Calendar, 
  Smartphone,
  Skull,
  MessageCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSchedule } from '@/contexts/ScheduleContext';
import { useForumStats } from '@/hooks/useForumStats';

const navItems = [
  { path: 'http://wa.me/555123990766', title: 'BM GPT', icon: Skull, external: true },
  { path: '/suspects', title: 'Suspeitos', icon: User },
  { path: '/documents', title: 'Documentos', icon: FileText },
  { path: '/schedule', title: 'Agenda', icon: Calendar },
  { path: '/forum', title: 'Fórum', icon: MessageCircle },
  { path: '/shortcuts', title: 'Aplicativos', icon: Smartphone },
];

export function Navbar() {
  const location = useLocation();
  const { remainingHours, totalWorkedHours } = useSchedule();
  const { unansweredQuestions } = useForumStats();
  
  const handleNavigation = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.external) {
      e.preventDefault();
      window.open(item.path, '_blank');
    }
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900 to-police-blue border-t border-t-white/10 z-10">
      <div className="flex justify-between w-full max-w-screen-lg mx-auto px-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-2 text-center transition-all relative",
              location.pathname === item.path && !item.external
                ? "text-police-gold"
                : "text-white/70 hover:text-white"
            )}
            onClick={(e) => handleNavigation(item, e)}
          >
            <div className="relative">
              <item.icon className="h-5 w-5 mb-1" />
              
              {/* Schedule hours badges - agora metade do tamanho atual (antes eram 1.5x maiores) */}
              {item.path === '/schedule' && (
                <>
                  {remainingHours > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 px-1 py-0.25 min-h-[12px] min-w-[12px] text-[10px] bg-yellow-400 text-yellow-950 border-none"
                    >
                      {remainingHours}
                    </Badge>
                  )}
                  {totalWorkedHours > 0 && (
                    <Badge 
                      className="absolute -bottom-2 -right-2 px-1 py-0.25 min-h-[12px] min-w-[12px] text-[10px] bg-green-500 text-green-950 border-none"
                    >
                      {totalWorkedHours}
                    </Badge>
                  )}
                </>
              )}
              
              {/* Forum unanswered questions badge - agora metade do tamanho atual (antes era 1.5x maior) */}
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
