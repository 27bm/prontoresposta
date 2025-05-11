
import React from 'react';
import { Document } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Edit, Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DocumentCardProps {
  document: Document;
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
}

export function DocumentCard({ document, onEdit, onDelete }: DocumentCardProps) {
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

  // Calcular tempo desde a criação
  const timeAgo = formatDistanceToNow(new Date(document.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Card className="mb-3 overflow-hidden border-l-4 border-l-police-blue">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold">{document.title}</h3>
              <Badge className={`${getBadgeVariant(document.type)}`}>
                {getTypeName(document.type)}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-500 mb-2">
              Atualizado {timeAgo}
            </p>
            
            <p className="text-sm line-clamp-2">
              {document.content}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
          {document.attachmentUrl ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-blue-600" 
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          ) : (
            <div></div>
          )}
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600" 
              onClick={() => onEdit(document)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600" 
              onClick={() => onDelete(document.id)}
            >
              <Trash className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
