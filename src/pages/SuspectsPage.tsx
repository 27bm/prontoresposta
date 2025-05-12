import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SuspectCard } from '@/components/suspects/SuspectCard';
import { SuspectForm } from '@/components/suspects/SuspectForm';
import { useSuspects } from '@/contexts/SuspectContext';
import { Suspect } from '@/types/models';
import { Plus, Search, Key, X } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

export function SuspectsPage() {
  const { 
    suspects, 
    addSuspect, 
    updateSuspect, 
    deleteSuspect, 
    searchSuspects, 
    loading,
    listToken,
    setListToken
  } = useSuspects();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [currentSuspect, setCurrentSuspect] = useState<Suspect | undefined>(undefined);
  const [suspectToDelete, setSuspectToDelete] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [activeNeighborhood, setActiveNeighborhood] = useState<string | null>(null);
  const [activeFaction, setActiveFaction] = useState<string | null>(null);
  
  // Show token dialog if no token is set
  useEffect(() => {
    if (!listToken) {
      setIsTokenDialogOpen(true);
    }
  }, [listToken]);
  
  // Get unique neighborhoods from suspects
  const neighborhoods = useMemo(() => {
    const uniqueNeighborhoods = new Set<string>();
    
    suspects.forEach(suspect => {
      if (suspect.neighborhood && suspect.neighborhood.trim()) {
        uniqueNeighborhoods.add(suspect.neighborhood);
      }
    });
    
    return Array.from(uniqueNeighborhoods).sort();
  }, [suspects]);
  
  // Get unique factions from suspects
  const factions = useMemo(() => {
    const uniqueFactions = new Set<string>();
    
    suspects.forEach(suspect => {
      if (suspect.faction && suspect.faction.trim()) {
        uniqueFactions.add(suspect.faction);
      }
    });
    
    return Array.from(uniqueFactions).sort();
  }, [suspects]);
  
  // Filter suspects by search term, neighborhood, and faction
  const filteredSuspects = useMemo(() => {
    // First filter by search term
    let filtered = searchTerm ? searchSuspects(searchTerm) : suspects;
    
    // Then filter by active neighborhood if one is selected
    if (activeNeighborhood) {
      filtered = filtered.filter(suspect => 
        suspect.neighborhood === activeNeighborhood
      );
    }
    
    // Then filter by active faction if one is selected
    if (activeFaction) {
      filtered = filtered.filter(suspect => 
        suspect.faction === activeFaction
      );
    }
    
    return filtered;
  }, [suspects, searchTerm, activeNeighborhood, activeFaction, searchSuspects]);
  
  // Handle neighborhood filter toggle
  const handleNeighborhoodClick = (neighborhood: string) => {
    if (activeNeighborhood === neighborhood) {
      // If clicking the active neighborhood, deselect it
      setActiveNeighborhood(null);
    } else {
      // Otherwise, select the clicked neighborhood
      setActiveNeighborhood(neighborhood);
    }
  };
  
  // Handle faction filter toggle
  const handleFactionClick = (faction: string) => {
    if (activeFaction === faction) {
      // If clicking the active faction, deselect it
      setActiveFaction(null);
    } else {
      // Otherwise, select the clicked faction
      setActiveFaction(faction);
    }
  };
  
  // Funções de manipulação do formulário
  const handleAddClick = () => {
    setCurrentSuspect(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditClick = (suspect: Suspect) => {
    setCurrentSuspect(suspect);
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = (id: string) => {
    setSuspectToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (suspectToDelete) {
      deleteSuspect(suspectToDelete);
      setSuspectToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleFormSave = (suspect: Omit<Suspect, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (currentSuspect) {
      updateSuspect(currentSuspect.id, suspect);
    } else {
      addSuspect(suspect);
    }
    
    setIsFormOpen(false);
  };
  
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      setListToken(tokenInput.trim());
      setIsTokenDialogOpen(false);
    }
  };
  
  const changeToken = () => {
    setIsTokenDialogOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Pesquisar por nome, apelido, bairro ou observações"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {listToken && (
            <Button 
              onClick={changeToken} 
              variant="outline" 
              className="flex-shrink-0"
              title="Mudar token de acesso"
            >
              <Key className="h-4 w-4 mr-1" />
              Mudar Token
            </Button>
          )}
          {listToken && (
            <Button
              onClick={handleAddClick}
              className="bg-police-blue hover:bg-police-lightBlue flex-shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Suspeito
            </Button>
          )}
        </div>
      </div>
      
      {/* Neighborhood filter buttons */}
      {neighborhoods.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-sm font-medium mr-1 flex items-center">Bairros:</span>
          {neighborhoods.map((neighborhood) => (
            <Badge
              key={neighborhood}
              variant={activeNeighborhood === neighborhood ? "default" : "outline"}
              className={`cursor-pointer ${
                activeNeighborhood === neighborhood 
                  ? "bg-police-blue hover:bg-police-lightBlue" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleNeighborhoodClick(neighborhood)}
            >
              {neighborhood}
              {activeNeighborhood === neighborhood && (
                <X 
                  className="h-3 w-3 ml-1" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveNeighborhood(null);
                  }}
                />
              )}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Faction filter buttons */}
      {factions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-sm font-medium mr-1 flex items-center">Facções:</span>
          {factions.map((faction) => (
            <Badge
              key={faction}
              variant={activeFaction === faction ? "default" : "outline"}
              className={`cursor-pointer ${
                activeFaction === faction 
                  ? "bg-police-red hover:bg-red-700"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleFactionClick(faction)}
            >
              {faction}
              {activeFaction === faction && (
                <X 
                  className="h-3 w-3 ml-1" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFaction(null);
                  }}
                />
              )}
            </Badge>
          ))}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse text-center">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      ) : filteredSuspects.length > 0 ? (
        <div className="space-y-2">
          {filteredSuspects.map((suspect) => (
            <SuspectCard
              key={suspect.id}
              suspect={suspect}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {listToken ? (
              activeNeighborhood && activeFaction ? (
                `Nenhum suspeito encontrado no bairro: ${activeNeighborhood} e facção: ${activeFaction}`
              ) : activeNeighborhood ? (
                `Nenhum suspeito encontrado no bairro: ${activeNeighborhood}`
              ) : activeFaction ? (
                `Nenhum suspeito encontrado na facção: ${activeFaction}`
              ) : searchTerm ? (
                "Nenhum suspeito encontrado para a pesquisa: " + searchTerm
              ) : (
                "Nenhum suspeito cadastrado nesta lista."
              )
            ) : (
              "Informe um token para acessar uma lista de suspeitos."
            )}
          </p>
          {listToken && !searchTerm && !activeNeighborhood && !activeFaction && (
            <Button
              onClick={handleAddClick}
              className="mt-4 bg-police-blue hover:bg-police-lightBlue"
            >
              Adicionar Suspeito
            </Button>
          )}
        </div>
      )}
      
      {/* Modal do formulário */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentSuspect ? 'Editar Suspeito' : 'Adicionar Novo Suspeito'}
            </DialogTitle>
          </DialogHeader>
          <SuspectForm
            suspect={currentSuspect}
            onSave={handleFormSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Token Dialog */}
      <Dialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Acesso à Lista de Suspeitos
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTokenSubmit} className="space-y-4 p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Informe um token para acessar uma lista de suspeitos existente. Se o token não existir, uma nova lista será criada.
              </p>
              <Input 
                value={tokenInput} 
                onChange={(e) => setTokenInput(e.target.value)} 
                placeholder="Digite o token de acesso"
                required
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-police-blue hover:bg-police-lightBlue">
                Acessar Lista
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este suspeito? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SuspectsPage;
