
import React from 'react';
import { Document } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';

interface DocumentCardProps {
  document: Document;
  onClick: (document: Document) => void;
}

export function DocumentCard({ document, onClick }: DocumentCardProps) {
  // Função para determinar a cor do border com base no tipo
  const getBorderColor = (type: Document['type']) => {
    switch (type) {
      case 'bulletin':
        return 'border-l-blue-500';
      case 'procedure':
        return 'border-l-green-500';
      case 'instruction':
        return 'border-l-amber-500';
      case 'traffic':
        return 'border-l-purple-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <Card 
      className={`mb-3 overflow-hidden border-l-4 ${getBorderColor(document.type)} cursor-pointer hover:shadow-md transition-shadow`} 
      onClick={() => onClick(document)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <div className="mb-2">
              <h3 className="text-lg font-bold">{document.title}</h3>
            </div>
            
            <p className="text-sm line-clamp-2 mb-4">
              {document.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
