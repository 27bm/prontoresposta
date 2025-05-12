import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Suspect } from '../types/models';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SuspectContextType {
  suspects: Suspect[];
  addSuspect: (suspect: Omit<Suspect, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSuspect: (id: string, suspect: Partial<Suspect>) => void;
  deleteSuspect: (id: string) => void;
  searchSuspects: (term: string) => Suspect[];
  loading: boolean;
  listToken: string | null;
  setListToken: (token: string) => void;
  listId: string | null;
}

const SuspectContext = createContext<SuspectContextType | undefined>(undefined);

// Helper function to convert Supabase data to our app's Suspect type
const mapSupabaseToSuspect = (item: any): Suspect => ({
  id: item.id,
  name: item.name,
  rg: item.rg || undefined,
  cpf: item.cpf || undefined,
  nickname: item.nickname || undefined,
  neighborhood: item.neighborhood || undefined,
  faction: item.faction || undefined, // Adicionado campo de facção
  observations: item.observations || undefined,
  photoUrl: item.photo_url || undefined,
  createdAt: new Date(item.created_at),
  updatedAt: new Date(item.updated_at)
});

// Helper function to convert our app's Suspect type to Supabase format
const mapSuspectToSupabase = (suspect: any, listId: string) => ({
  name: suspect.name,
  rg: suspect.rg || null,
  cpf: suspect.cpf || null,
  nickname: suspect.nickname || null,
  neighborhood: suspect.neighborhood || null,
  faction: suspect.faction || null, // Adicionado campo de facção
  observations: suspect.observations || null,
  photo_url: suspect.photoUrl || null,
  list_id: listId
});

export function SuspectProvider({ children }: { children: ReactNode }) {
  const [suspects, setSuspects] = useState<Suspect[]>([]);
  const [loading, setLoading] = useState(false);
  const [listToken, setListToken] = useState<string | null>(
    localStorage.getItem('suspectListToken')
  );
  const [listId, setListId] = useState<string | null>(null);

  // Function to get or create a list by token
  const getOrCreateList = async (token: string) => {
    setLoading(true);
    
    try {
      // First, try to fetch the list by token
      const { data: existingList, error: fetchError } = await supabase
        .from('suspect_lists')
        .select('*')
        .eq('token', token)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        // An error occurred that is not "No rows returned"
        toast.error('Erro ao buscar lista: ' + fetchError.message);
        setLoading(false);
        return null;
      }
      
      // If the list exists, return it
      if (existingList) {
        return existingList;
      }
      
      // If list doesn't exist, create a new one
      const { data: newList, error: insertError } = await supabase
        .from('suspect_lists')
        .insert([{ token }])
        .select()
        .single();
      
      if (insertError) {
        toast.error('Erro ao criar lista: ' + insertError.message);
        setLoading(false);
        return null;
      }
      
      toast.success('Nova lista de suspeitos criada!');
      return newList;
      
    } catch (error) {
      console.error('Erro ao processar lista:', error);
      toast.error('Ocorreu um erro ao processar a lista');
      setLoading(false);
      return null;
    }
  };
  
  // Handle token changes and load suspects
  useEffect(() => {
    const loadSuspects = async () => {
      if (!listToken) {
        setSuspects([]);
        setListId(null);
        return;
      }
      
      setLoading(true);
      
      try {
        // Save token to localStorage
        localStorage.setItem('suspectListToken', listToken);
        
        // Get or create list
        const list = await getOrCreateList(listToken);
        
        if (list) {
          setListId(list.id);
          
          // Fetch suspects for this list
          const { data, error } = await supabase
            .from('suspects')
            .select('*')
            .eq('list_id', list.id);
            
          if (error) {
            throw error;
          }
          
          if (data) {
            setSuspects(data.map(mapSupabaseToSuspect));
          }
        }
      } catch (error) {
        console.error('Error loading suspects:', error);
        toast.error('Erro ao carregar suspeitos');
      } finally {
        setLoading(false);
      }
    };
    
    loadSuspects();
  }, [listToken]);

  const addSuspect = async (suspect: Omit<Suspect, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!listId) {
      toast.error('Nenhuma lista selecionada');
      return;
    }
    
    setLoading(true);
    try {
      const suspectData = mapSuspectToSupabase(suspect, listId);
      
      const { data, error } = await supabase
        .from('suspects')
        .insert([suspectData])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const newSuspect = mapSupabaseToSuspect(data);
        setSuspects(prev => [...prev, newSuspect]);
        toast.success('Suspeito adicionado com sucesso!');
      }
    } catch (error) {
      console.error('Error adding suspect:', error);
      toast.error('Erro ao adicionar suspeito');
    } finally {
      setLoading(false);
    }
  };

  const updateSuspect = async (id: string, updatedFields: Partial<Suspect>) => {
    if (!listId) {
      toast.error('Nenhuma lista selecionada');
      return;
    }
    
    setLoading(true);
    try {
      // Convert to Supabase format
      const updateData: any = {};
      if ('name' in updatedFields) updateData.name = updatedFields.name;
      if ('rg' in updatedFields) updateData.rg = updatedFields.rg || null;
      if ('cpf' in updatedFields) updateData.cpf = updatedFields.cpf || null;
      if ('nickname' in updatedFields) updateData.nickname = updatedFields.nickname || null;
      if ('neighborhood' in updatedFields) updateData.neighborhood = updatedFields.neighborhood || null;
      if ('faction' in updatedFields) updateData.faction = updatedFields.faction || null; // Adicionado campo de facção
      if ('observations' in updatedFields) updateData.observations = updatedFields.observations || null;
      if ('photoUrl' in updatedFields) updateData.photo_url = updatedFields.photoUrl || null;
      
      const { data, error } = await supabase
        .from('suspects')
        .update(updateData)
        .eq('id', id)
        .eq('list_id', listId)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const updatedSuspect = mapSupabaseToSuspect(data);
        setSuspects(prev => prev.map(s => s.id === id ? updatedSuspect : s));
        toast.success('Suspeito atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Error updating suspect:', error);
      toast.error('Erro ao atualizar suspeito');
    } finally {
      setLoading(false);
    }
  };

  const deleteSuspect = async (id: string) => {
    if (!listId) {
      toast.error('Nenhuma lista selecionada');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('suspects')
        .delete()
        .eq('id', id)
        .eq('list_id', listId);
        
      if (error) {
        throw error;
      }
      
      setSuspects(prev => prev.filter(suspect => suspect.id !== id));
      toast.success('Suspeito removido com sucesso!');
    } catch (error) {
      console.error('Error deleting suspect:', error);
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
      (suspect.faction && suspect.faction.toLowerCase().includes(lowerTerm)) || // Adicionado pesquisa por facção
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
      loading,
      listToken,
      setListToken,
      listId
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
