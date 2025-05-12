
import React from 'react';
import { useLocation } from 'react-router-dom';

const getTitle = (pathname: string) => {
  switch (pathname) {
    case '/suspects':
      return 'Lista de Suspeitos';
    case '/map':
      return 'Mapa Interativo';
    case '/documents':
      return 'Registros e Documentos';
    case '/schedule':
      return 'Agenda de Trabalho';
    case '/shortcuts':
      return 'Atalhos';
    case '/forum':
      return 'Fórum';
    default:
      return 'prontoresposta';
  }
};

export function Header() {
  const location = useLocation();
  const title = getTitle(location.pathname);
  
  return (
    <header className="sticky top-0 z-10 bg-police-blue bg-opacity-95 backdrop-blur-sm">
      <div className="flex items-center p-4 max-w-screen-lg mx-auto">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-police-gold rounded-full">
            <span className="text-police-blue font-bold">PR</span>
          </div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
      </div>
    </header>
  );
}
