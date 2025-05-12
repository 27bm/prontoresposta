
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

// Interface for a release item
interface ReleaseItem {
  id: string;
  content: string;
}

// Default content for the release
const DEFAULT_RELEASE_CONTENT = [
  { id: '1', content: '*PRISÃO POR XXXXXX*' },
  { id: '2', content: '*MUNICÍPIO CRPOYY/00° BPM*' },
  { id: '3', content: '' },
  { id: '4', content: '*Data/Hora:* 00/00/00 00:00' },
  { id: '5', content: '*Local:* Rua yyy, bairro xxxx' },
  { id: '6', content: '' },
  { id: '7', content: '*Vítima:* xxxx, RG 000' },
  { id: '8', content: '' },
  { id: '9', content: '*Preso*: xxx, 000' },
  { id: '10', content: '*Antecedentes:*' },
  { id: '11', content: 'Entorpecente posse' },
  { id: '12', content: '' },
  { id: '13', content: '*Oficial de SV externo/ Sgt SV externo:*' },
  { id: '14', content: '1º TEN PM  / 2° SGT PM' },
  { id: '15', content: '' },
  { id: '16', content: '*Documentação:*' },
  { id: '17', content: '' },
  { id: '18', content: '*Histórico:*' },
  { id: '19', content: 'A Brigada Militar foi acionada para ....' }
];

// Local storage key
const RELEASE_STORAGE_KEY = 'prontoresposta_release_data';

// Context interface
interface ReleaseContextType {
  releaseItems: ReleaseItem[];
  updateItem: (id: string, content: string) => void;
  addItem: (id: string, position: 'before' | 'after') => void;
  removeItem: (id: string) => void;
  moveItem: (id: string, direction: 'up' | 'down') => void;
  copyReleaseToClipboard: () => void;
  resetToDefault: () => void;
}

// Create context
const ReleaseContext = createContext<ReleaseContextType | undefined>(undefined);

// Provider component
export function ReleaseProvider({ children }: { children: ReactNode }) {
  const [releaseItems, setReleaseItems] = useState<ReleaseItem[]>(() => {
    // Try to load from localStorage
    const savedItems = localStorage.getItem(RELEASE_STORAGE_KEY);
    if (savedItems) {
      try {
        return JSON.parse(savedItems);
      } catch (error) {
        console.error('Error parsing saved release data:', error);
        return DEFAULT_RELEASE_CONTENT;
      }
    }
    return DEFAULT_RELEASE_CONTENT;
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(RELEASE_STORAGE_KEY, JSON.stringify(releaseItems));
    } catch (error) {
      console.error('Error saving release data:', error);
    }
  }, [releaseItems]);

  // Update a specific line
  const updateItem = (id: string, content: string) => {
    setReleaseItems(prev => 
      prev.map(item => item.id === id ? { ...item, content } : item)
    );
  };

  // Add a new line before or after an existing one
  const addItem = (id: string, position: 'before' | 'after') => {
    const newId = Date.now().toString();
    const index = releaseItems.findIndex(item => item.id === id);
    
    if (index !== -1) {
      const newItems = [...releaseItems];
      const insertIndex = position === 'after' ? index + 1 : index;
      newItems.splice(insertIndex, 0, { id: newId, content: '' });
      setReleaseItems(newItems);
    }
  };

  // Remove a line
  const removeItem = (id: string) => {
    // Prevent removing all items
    if (releaseItems.length <= 1) {
      toast.error('Não é possível remover o último item');
      return;
    }
    
    setReleaseItems(prev => prev.filter(item => item.id !== id));
  };

  // Move an item up or down
  const moveItem = (id: string, direction: 'up' | 'down') => {
    const index = releaseItems.findIndex(item => item.id === id);
    
    if (index === -1) return;
    
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === releaseItems.length - 1) return;
    
    const newItems = [...releaseItems];
    const item = newItems[index];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Remove from old position
    newItems.splice(index, 1);
    // Insert at new position
    newItems.splice(newIndex, 0, item);
    
    setReleaseItems(newItems);
  };

  // Copy all content to clipboard
  const copyReleaseToClipboard = () => {
    const text = releaseItems.map(item => item.content).join('\n');
    
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Texto copiado com sucesso!');
      })
      .catch(err => {
        console.error('Erro ao copiar texto:', err);
        toast.error('Erro ao copiar texto para a área de transferência');
      });
  };

  // Reset to default template
  const resetToDefault = () => {
    setReleaseItems(DEFAULT_RELEASE_CONTENT);
    toast.info('Release resetado para o modelo padrão');
  };

  return (
    <ReleaseContext.Provider value={{
      releaseItems,
      updateItem,
      addItem,
      removeItem,
      moveItem,
      copyReleaseToClipboard,
      resetToDefault
    }}>
      {children}
    </ReleaseContext.Provider>
  );
}

// Hook for using the context
export function useRelease() {
  const context = useContext(ReleaseContext);
  if (context === undefined) {
    throw new Error('useRelease must be used within a ReleaseProvider');
  }
  return context;
}
