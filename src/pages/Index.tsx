
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, MapPin, FileText, Calendar, Smartphone } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  // Redirecionar para a página de suspeitos após um curto período (opcional)
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/suspects');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  const menuItems = [
    {
      title: 'Lista de Suspeitos',
      icon: User,
      description: 'Cadastro e consulta de suspeitos',
      path: '/suspects',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Mapa Interativo',
      icon: MapPin,
      description: 'Visualização de pontos de interesse',
      path: '/map',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Registros e Documentos',
      icon: FileText,
      description: 'Biblioteca de documentos importantes',
      path: '/documents',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      title: 'Agenda de Trabalho',
      icon: Calendar,
      description: 'Controle de escala e horas trabalhadas',
      path: '/schedule',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Atalhos para Aplicativos',
      icon: Smartphone,
      description: 'Links para aplicativos úteis',
      path: '/shortcuts',
      color: 'bg-red-100 text-red-600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="bg-gradient-to-b from-police-blue via-police-lightBlue to-blue-400 text-white p-8 rounded-b-xl mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">PoliceApp</h1>
        <p className="text-lg opacity-90">
          Ferramentas essenciais para policiais em serviço
        </p>
      </div>
      
      {/* Menu de navegação rápida */}
      <div className="flex-grow px-4 pb-8">
        <h2 className="text-xl font-bold mb-4">Acesso rápido</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Card key={item.path} className="overflow-hidden">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full h-full flex items-start text-left p-4"
                  onClick={() => navigate(item.path)}
                >
                  <div className={`mr-4 p-3 rounded-lg ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
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
