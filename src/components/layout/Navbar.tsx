
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  User, 
  FileText, 
  Calendar, 
  Smartphone,
  Home,
  Activity
} from 'lucide-react';

const navItems = [
  { path: '/', title: 'Início', icon: Home },
  { path: '/suspects', title: 'Suspeitos', icon: User },
  { path: '/documents', title: 'Documentos', icon: FileText },
  { path: '/schedule', title: 'Agenda', icon: Calendar },
  { path: '/shortcuts', title: 'Aplicativos', icon: Smartphone },
  { path: '/taf', title: 'TAF', icon: Activity },
];

export function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900 to-police-blue border-t border-t-white/10 z-10">
      <div className="flex items-center justify-between max-w-screen-lg mx-auto overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center py-2 px-3 flex-1 text-center transition-all",
              location.pathname === item.path
                ? "text-police-gold"
                : "text-white/70 hover:text-white"
            )}
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
