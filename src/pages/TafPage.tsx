
import React from 'react';
import { TafCalculator } from '@/components/taf/TafCalculator';

export function TafPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="text-sm text-gray-600 mb-6">
        <p>
          Calculadora de pontuação automática para o Teste de Aptidão Física (TAF). 
          Selecione as opções abaixo para calcular sua pontuação.
        </p>
      </div>
      <TafCalculator />
    </div>
  );
}

export default TafPage;
