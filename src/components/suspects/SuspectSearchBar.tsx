
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Key, Plus, Share, GalleryHorizontal, GalleryVertical } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface SuspectSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  listToken: string | null;
  onChangeToken: () => void;
  onAddSuspect: () => void;
  isGalleryView: boolean;
  toggleGalleryView: () => void;
}

export function SuspectSearchBar({ 
  searchTerm, 
  setSearchTerm, 
  listToken, 
  onChangeToken, 
  onAddSuspect,
  isGalleryView,
  toggleGalleryView
}: SuspectSearchBarProps) {
  const isMobile = useIsMobile();
  
  const handleShareClick = () => {
    if (!listToken) return;
    
    // Create the shareable URL with the token as query parameter
    const shareableUrl = `${window.location.origin}/suspects?token=${listToken}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableUrl).then(() => {
      toast.success("Link copiado para a área de transferência!");
    }).catch(() => {
      toast.error("Falha ao copiar o link");
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={isMobile ? "Pesquisar..." : "Pesquisar por nome, apelido, bairro ou observações"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-2 justify-between sm:justify-end">
        {listToken && (
          <Button 
            onClick={toggleGalleryView} 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="flex-shrink-0"
            title={isGalleryView ? "Visualização em lista" : "Visualização em galeria"}
          >
            {isGalleryView ? (
              <GalleryVertical className="h-4 w-4" />
            ) : (
              <GalleryHorizontal className="h-4 w-4" />
            )}
            {!isMobile && (isGalleryView ? " Lista" : " Galeria")}
          </Button>
        )}
        {listToken && (
          <Button 
            onClick={handleShareClick} 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="flex-shrink-0"
            title="Compartilhar lista"
          >
            <Share className="h-4 w-4" />
            {!isMobile && " Compartilhar"}
          </Button>
        )}
        {listToken && (
          <Button 
            onClick={onChangeToken} 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="flex-shrink-0"
            title="Mudar token de acesso"
          >
            <Key className="h-4 w-4" />
            {!isMobile && " Mudar Token"}
          </Button>
        )}
        {listToken && (
          <Button
            onClick={onAddSuspect}
            size={isMobile ? "sm" : "default"}
            className="bg-police-blue hover:bg-police-lightBlue flex-shrink-0"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Suspeito
          </Button>
        )}
      </div>
    </div>
  );
}
