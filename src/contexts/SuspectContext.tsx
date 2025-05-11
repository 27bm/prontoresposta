
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Suspect } from '../types/models';
import { toast } from 'sonner';

// Mock data para exemplificar a lista de suspeitos
const initialSuspects: Suspect[] = [
  {
    id: '1',
    name: 'João Silva',
    rg: '12.345.678-9',
    cpf: '123.456.789-00',
    nickname: 'Jota',
    neighborhood: 'Centro',
    observations: 'Histórico de furtos em estabelecimentos comerciais',
    createdAt: new Date(2023, 5, 10),
    updatedAt: new Date(2023, 5, 10),
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    rg: '98.765.432-1',
    cpf: '987.654.321-00',
    nickname: 'Mari',
    neighborhood: 'Vila Nova',
    observations: 'Associação com tráfico local',
    createdAt: new Date(2023, 6, 15),
    updatedAt: new Date(2023, 6, 15),
  },
];

interface SuspectContextType {
  suspects: Suspect[];
  addSuspect: (suspect: Omit<Suspect, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSuspect: (id: string, suspect: Partial<Suspect>) => void;
  deleteSuspect: (id: string) => void;
  searchSuspects: (term: string) => Suspect[];
  loading: boolean;
}

const SuspectContext = createContext<SuspectContextType | undefined>(undefined);

export function SuspectProvider({ children }: { children: ReactNode }) {
  const [suspects, setSuspects] = useState<Suspect[]>(initialSuspects);
  const [loading, setLoading] = useState(false);

  const addSuspect = (suspect: Omit<Suspect, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const newSuspect: Suspect = {
        ...suspect,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSuspects([...suspects, newSuspect]);
      toast.success('Suspeito adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar suspeito');
    } finally {
      setLoading(false);
    }
  };

  const updateSuspect = (id: string, updatedFields: Partial<Suspect>) => {
    setLoading(true);
    try {
      const updatedSuspects = suspects.map(suspect => {
        if (suspect.id === id) {
          return { 
            ...suspect, 
            ...updatedFields,
            updatedAt: new Date() 
          };
        }
        return suspect;
      });
      setSuspects(updatedSuspects);
      toast.success('Suspeito atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar suspeito');
    } finally {
      setLoading(false);
    }
  };

  const deleteSuspect = (id: string) => {
    setLoading(true);
    try {
      setSuspects(suspects.filter(suspect => suspect.id !== id));
      toast.success('Suspeito removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover suspeito');
    } finally {
      setLoading(false);
    }
  };

  const searchSuspects = (term: string) => {
    if (!term) return suspects;
    
    const lowerTerm = term.toLowerCase();
    return suspects.filter(suspect => 
      suspect.name.toLowerCase().includes(lowerTerm) ||
      (suspect.nickname && suspect.nickname.toLowerCase().includes(lowerTerm)) ||
      (suspect.neighborhood && suspect.neighborhood.toLowerCase().includes(lowerTerm)) ||
      (suspect.observations && suspect.observations.toLowerCase().includes(lowerTerm))
    );
  };

  return (
    <SuspectContext.Provider value={{ 
      suspects, 
      addSuspect, 
      updateSuspect, 
      deleteSuspect,
      searchSuspects,
      loading 
    }}>
      {children}
    </SuspectContext.Provider>
  );
}

export function useSuspects() {
  const context = useContext(SuspectContext);
  if (context === undefined) {
    throw new Error('useSuspects must be used within a SuspectProvider');
  }
  return context;
}
