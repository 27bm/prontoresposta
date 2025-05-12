
import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SuspectCard } from '@/components/suspects/SuspectCard';
import { SuspectForm } from '@/components/suspects/SuspectForm';
import { useSuspects } from '@/contexts/SuspectContext';
import { Suspect } from '@/types/models';
import { SuspectSearchBar } from '@/components/suspects/SuspectSearchBar';
import { FilterBadges } from '@/components/suspects/SuspectFilterBadges';
import { NoSuspectsFound } from '@/components/suspects/NoSuspectsFound';
import { TokenDialog } from '@/components/suspects/TokenDialog';
import { DeleteConfirmDialog } from '@/components/suspects/DeleteConfirmDialog';

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
  const [activeGrupo, setActiveGrupo] = useState<string | null>(null);
  
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
  
  // Get unique grupos from suspects
  const grupos = useMemo(() => {
    const uniqueGrupos = new Set<string>();
    
    suspects.forEach(suspect => {
      if (suspect.grupo && suspect.grupo.trim()) {
        uniqueGrupos.add(suspect.grupo);
      }
    });
    
    return Array.from(uniqueGrupos).sort();
  }, [suspects]);
  
  // Filter suspects by search term, neighborhood, and grupo
  const filteredSuspects = useMemo(() => {
    // First filter by search term
    let filtered = searchTerm ? searchSuspects(searchTerm) : suspects;
    
    // Then filter by active neighborhood if one is selected
    if (activeNeighborhood) {
      filtered = filtered.filter(suspect => 
        suspect.neighborhood === activeNeighborhood
      );
    }
    
    // Then filter by active grupo if one is selected
    if (activeGrupo) {
      filtered = filtered.filter(suspect => 
        suspect.grupo === activeGrupo
      );
    }
    
    return filtered;
  }, [suspects, searchTerm, activeNeighborhood, activeGrupo, searchSuspects]);
  
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
  
  // Handle grupo filter toggle
  const handleGrupoClick = (grupo: string) => {
    if (activeGrupo === grupo) {
      // If clicking the active grupo, deselect it
      setActiveGrupo(null);
    } else {
      // Otherwise, select the clicked grupo
      setActiveGrupo(grupo);
    }
  };
  
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
      <SuspectSearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        listToken={listToken}
        onChangeToken={changeToken}
        onAddSuspect={handleAddClick}
      />
      
      {/* Combined filter badges in a single row */}
      <div className="flex flex-wrap gap-2">
        <FilterBadges 
          items={neighborhoods}
          activeItem={activeNeighborhood}
          label=""
          onItemClick={handleNeighborhoodClick}
        />
        
        <FilterBadges 
          items={grupos}
          activeItem={activeGrupo}
          label=""
          onItemClick={handleGrupoClick}
          badgeClassName={(active) => active ? "bg-police-red hover:bg-red-700" : "hover:bg-gray-100"}
        />
      </div>
      
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
        <NoSuspectsFound
          listToken={listToken}
          searchTerm={searchTerm}
          activeNeighborhood={activeNeighborhood}
          activeGrupo={activeGrupo}
          onAddClick={handleAddClick}
        />
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
      <TokenDialog
        isOpen={isTokenDialogOpen}
        onOpenChange={setIsTokenDialogOpen}
        tokenInput={tokenInput}
        setTokenInput={setTokenInput}
        onSubmit={handleTokenSubmit}
      />
      
      {/* Diálogo de confirmação de exclusão */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default SuspectsPage;
