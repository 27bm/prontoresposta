
import React from 'react';
import { TafCalculator } from '@/components/taf/TafCalculator';
import { Info } from 'lucide-react';

export function TafPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="text-sm text-gray-600 mb-6 space-y-2">
        <p>
          Calculadora de pontuação automática para o Teste de Aptidão Física (TAF). 
          Selecione as opções abaixo para calcular sua pontuação.
        </p>
        <p className="flex items-center text-xs text-blue-600">
          <Info className="w-4 h-4 mr-1" /> 
          Suas seleções são salvas automaticamente e serão restauradas quando você retornar.
        </p>
      </div>
      <TafCalculator />
    </div>
  );
}

export default TafPage;
