
import React from 'react';
import { Document } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DocumentCardProps {
  document: Document;
  onClick: (document: Document) => void;
}

export function DocumentCard({ document, onClick }: DocumentCardProps) {
  // Função para determinar a cor do badge com base no tipo
  const getBadgeVariant = (type: Document['type']) => {
    switch (type) {
      case 'bulletin':
        return 'bg-blue-500';
      case 'procedure':
        return 'bg-green-500';
      case 'instruction':
        return 'bg-amber-500';
      case 'traffic':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Função para obter o nome amigável do tipo
  const getTypeName = (type: Document['type']) => {
    switch (type) {
      case 'bulletin':
        return 'Boletim';
      case 'procedure':
        return 'Procedimento';
      case 'instruction':
        return 'Instrução';
      case 'traffic':
        return 'Trânsito';
      default:
        return 'Outro';
    }
  };

  return (
    <Card 
      className="mb-3 overflow-hidden border-l-4 border-l-police-blue cursor-pointer hover:shadow-md transition-shadow" 
      onClick={() => onClick(document)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold">{document.title}</h3>
              <Badge className={`${getBadgeVariant(document.type)}`}>
                {getTypeName(document.type)}
              </Badge>
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
