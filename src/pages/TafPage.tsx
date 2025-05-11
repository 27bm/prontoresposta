
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TafForm } from '@/components/taf/TafForm';
import { TafResultCard } from '@/components/taf/TafResult';
import { TafFormData, TafResult } from '@/types/taf';
import { calculateTafResult } from '@/utils/tafCalculator';
import { Calculator } from 'lucide-react';

export function TafPage() {
  const [result, setResult] = useState<TafResult | null>(null);
  const [formData, setFormData] = useState<TafFormData | null>(null);
  
  const handleFormSubmit = (data: TafFormData) => {
    setFormData(data);
    const calculatedResult = calculateTafResult(data);
    setResult(calculatedResult);
  };
  
  const handleReset = () => {
    setResult(null);
    setFormData(null);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <Calculator className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold ml-3">Calculadora TAF</h2>
          </div>
          
          {result ? (
            <div className="space-y-6">
              <TafResultCard result={result} />
              
              <div className="flex justify-between pt-4 border-t">
                <button 
                  onClick={handleReset}
                  className="text-blue-600 font-medium"
                >
                  Calcular novamente
                </button>
              </div>
            </div>
          ) : (
            <TafForm onSubmit={handleFormSubmit} defaultValues={formData || undefined} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TafPage;
