
import React from 'react';
import { TafResult } from '@/types/taf';
import { Card, CardContent } from '@/components/ui/card';
import { getTafResultTypeText } from '@/utils/tafCalculator';

interface TafResultCardProps {
  result: TafResult;
}

export function TafResultCard({ result }: TafResultCardProps) {
  const getResultColor = () => {
    switch (result.resultType) {
      case 'excellent': return 'bg-green-500';
      case 'very_good': return 'bg-emerald-500';
      case 'good': return 'bg-blue-500';
      case 'regular': return 'bg-amber-500';
      case 'insufficient': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800">Resultado Final</h3>
        <div className="mt-2 inline-flex items-center px-4 py-2 rounded-full text-white font-medium text-lg" style={{ backgroundColor: getResultColor() }}>
          {getTafResultTypeText(result.resultType)}
        </div>
        <p className="text-3xl font-bold mt-2 text-gray-800">{result.totalScore} pontos</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-gray-800">Classificação:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li><span className="font-medium">Excelente:</span> 300 pontos</li>
              <li><span className="font-medium">Muito Bom:</span> 255 a 299 pontos</li>
              <li><span className="font-medium">Bom:</span> 211 a 254 pontos</li>
              <li><span className="font-medium">Regular:</span> 151 a 210 pontos</li>
              <li><span className="font-medium">Insuficiente:</span> até 150 pontos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
