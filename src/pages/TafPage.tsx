
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TafForm } from '@/components/taf/TafForm';
import { Calculator } from 'lucide-react';

export function TafPage() {
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
          
          <TafForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default TafPage;
