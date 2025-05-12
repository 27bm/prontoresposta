
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface NoSuspectsFoundProps {
  listToken: string | null;
  searchTerm: string;
  activeNeighborhood: string | null;
  activeGrupo: string | null; // Renomeado de "activeFaction" para "activeGrupo"
  onAddClick: () => void;
}

export function NoSuspectsFound({ 
  listToken, 
  searchTerm, 
  activeNeighborhood, 
  activeGrupo,  // Renomeado de "activeFaction" para "activeGrupo"
  onAddClick 
}: NoSuspectsFoundProps) {
  return (
    <div className="text-center py-10">
      <p className="text-gray-500">
        {listToken ? (
          activeNeighborhood && activeGrupo ? (
            `Nenhum suspeito encontrado no bairro: ${activeNeighborhood} e grupo: ${activeGrupo}`
          ) : activeNeighborhood ? (
            `Nenhum suspeito encontrado no bairro: ${activeNeighborhood}`
          ) : activeGrupo ? (
            `Nenhum suspeito encontrado no grupo: ${activeGrupo}`
          ) : searchTerm ? (
            "Nenhum suspeito encontrado para a pesquisa: " + searchTerm
          ) : (
            "Nenhum suspeito cadastrado nesta lista."
          )
        ) : (
          "Informe um token para acessar uma lista de suspeitos."
        )}
      </p>
      {listToken && !searchTerm && !activeNeighborhood && !activeGrupo && (
        <Button
          onClick={onAddClick}
          className="mt-4 bg-police-blue hover:bg-police-lightBlue"
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Suspeito
        </Button>
      )}
    </div>
  );
}
