
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Key, Plus, Share } from 'lucide-react';
import { toast } from 'sonner';

interface SuspectSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  listToken: string | null;
  onChangeToken: () => void;
  onAddSuspect: () => void;
}

export function SuspectSearchBar({ 
  searchTerm, 
  setSearchTerm, 
  listToken, 
  onChangeToken, 
  onAddSuspect 
}: SuspectSearchBarProps) {
  const handleShareClick = () => {
    if (!listToken) return;
    
    // Create the shareable URL with the current token
    const shareableUrl = `${window.location.origin}/suspects/${listToken}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableUrl).then(() => {
      toast.success("Link copiado para a área de transferência!");
    }).catch(() => {
      toast.error("Falha ao copiar o link");
    });
  };

  return (
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
            onClick={handleShareClick} 
            variant="outline" 
            className="flex-shrink-0"
            title="Compartilhar lista"
          >
            <Share className="h-4 w-4 mr-1" />
            Compartilhar
          </Button>
        )}
        {listToken && (
          <Button 
            onClick={onChangeToken} 
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
            onClick={onAddSuspect}
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
