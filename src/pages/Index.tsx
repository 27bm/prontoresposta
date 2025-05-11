
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, FileText, Calendar, Smartphone, Calculator, Skull, MessageCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: 'Lista de Suspeitos',
      icon: User,
      path: '/suspects',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Registros e Documentos',
      icon: FileText,
      path: '/documents',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      title: 'Agenda de Trabalho',
      icon: Calendar,
      path: '/schedule',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Atalhos para Aplicativos',
      icon: Smartphone,
      path: '/shortcuts',
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Calculadora TAF',
      icon: Calculator,
      path: '/taf',
      color: 'bg-cyan-100 text-cyan-600',
    },
    {
      title: 'Fórum Anônimo',
      icon: MessageCircle,
      path: '/forum',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'BM GPT',
      icon: Skull,
      path: 'http://wa.me/555123990766',
      color: 'bg-gray-100 text-gray-600',
      isExternal: true,
    },
  ];

  const handleNavigation = (item: typeof menuItems[0]) => {
    if (item.isExternal) {
      window.open(item.path, '_blank');
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="min-h-screen flex flex-col -mt-4 -mx-4 bg-gray-50">      
      {/* Menu de navegação rápida */}
      <div className="relative z-10 flex-grow px-4 pb-8 pt-20 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Card key={item.path} className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full h-full flex items-center text-left p-6"
                  onClick={() => handleNavigation(item)}
                >
                  <div className={`mr-4 p-3 rounded-lg ${item.color}`}>
                    <item.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
