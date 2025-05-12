
import React from 'react';
import { TafCalculator } from '@/components/taf/TafCalculator';

export function TafPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Calculadora TAF</h1>
      <p className="text-sm text-gray-600 mb-6">
        Calculadora de pontuação automática para o Teste de Aptidão Física (TAF). 
        Selecione as opções abaixo para calcular sua pontuação.
      </p>
      <TafCalculator />
    </div>
  );
}

export default TafPage;
