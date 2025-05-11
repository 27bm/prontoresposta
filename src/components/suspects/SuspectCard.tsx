
import React from 'react';
import { Suspect } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash, User } from 'lucide-react';

interface SuspectCardProps {
  suspect: Suspect;
  onEdit: (suspect: Suspect) => void;
  onDelete: (id: string) => void;
}

export function SuspectCard({ suspect, onEdit, onDelete }: SuspectCardProps) {
  return (
    <Card className="mb-3 overflow-hidden border-l-4 border-l-police-blue">
      <CardContent className="p-0">
        <div className="flex items-start p-4">
          <div className="flex-shrink-0 mr-4">
            {suspect.photoUrl ? (
              <img 
                src={suspect.photoUrl} 
                alt={suspect.name} 
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold">{suspect.name}</h3>
            
            <div className="text-sm text-gray-600 space-y-1 mt-1">
              {suspect.nickname && (
                <p><span className="font-medium">Apelido:</span> {suspect.nickname}</p>
              )}
              
              {suspect.neighborhood && (
                <p><span className="font-medium">Bairro:</span> {suspect.neighborhood}</p>
              )}
              
              <div className="flex flex-wrap gap-4 mt-1">
                {suspect.rg && (
                  <p><span className="font-medium">RG:</span> {suspect.rg}</p>
                )}
                
                {suspect.cpf && (
                  <p><span className="font-medium">CPF:</span> {suspect.cpf}</p>
                )}
              </div>
            </div>
            
            {suspect.observations && (
              <p className="text-sm mt-2 bg-gray-50 p-2 rounded-md">
                <span className="font-medium">Observações:</span> {suspect.observations}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end p-2 pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600" 
            onClick={() => onEdit(suspect)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600" 
            onClick={() => onDelete(suspect.id)}
          >
            <Trash className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
