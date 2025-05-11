
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AppShortcut } from '../types/models';
import { toast } from 'sonner';

// Mock data para atalhos de aplicativos
const initialAppShortcuts: AppShortcut[] = [
  {
    id: '1',
    name: 'SINESP Cidadão',
    description: 'Consulta de veículos, mandados de prisão e pessoas desaparecidas',
    downloadUrl: 'https://play.google.com/store/apps/details?id=br.gov.sinesp.cidadao.android',
    isSystemDefault: true,
  },
  {
    id: '2',
    name: 'SINESP CAD',
    description: 'Cadastro e consulta de ocorrências policiais',
    downloadUrl: 'https://play.google.com/store/apps/details?id=br.gov.sinesp.cad.mobile',
    isSystemDefault: true,
  },
  {
    id: '3',
    name: 'Código Penal',
    description: 'Acesso rápido à legislação penal brasileira atualizada',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.andromo.dev576124.app849113',
    isSystemDefault: true,
  },
  {
    id: '4',
    name: 'CTB Digital',
    description: 'Código de Trânsito Brasileiro completo e atualizado',
    downloadUrl: 'https://play.google.com/store/apps/details?id=br.com.ctbdigital',
    isSystemDefault: true,
  },
];

interface AppShortcutContextType {
  appShortcuts: AppShortcut[];
  addAppShortcut: (appShortcut: Omit<AppShortcut, 'id' | 'isSystemDefault'>) => void;
  updateAppShortcut: (id: string, appShortcut: Partial<Omit<AppShortcut, 'isSystemDefault'>>) => void;
  deleteAppShortcut: (id: string) => void;
  loading: boolean;
}

const AppShortcutContext = createContext<AppShortcutContextType | undefined>(undefined);

export function AppShortcutProvider({ children }: { children: ReactNode }) {
  const [appShortcuts, setAppShortcuts] = useState<AppShortcut[]>(initialAppShortcuts);
  const [loading, setLoading] = useState(false);

  const addAppShortcut = (appShortcut: Omit<AppShortcut, 'id' | 'isSystemDefault'>) => {
    setLoading(true);
    try {
      const newAppShortcut: AppShortcut = {
        ...appShortcut,
        id: Date.now().toString(),
        isSystemDefault: false,
      };
      setAppShortcuts([...appShortcuts, newAppShortcut]);
      toast.success('Atalho adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar atalho');
    } finally {
      setLoading(false);
    }
  };

  const updateAppShortcut = (id: string, updatedFields: Partial<Omit<AppShortcut, 'isSystemDefault'>>) => {
    setLoading(true);
    try {
      const updatedAppShortcuts = appShortcuts.map(shortcut => {
        if (shortcut.id === id && !shortcut.isSystemDefault) {
          return { ...shortcut, ...updatedFields };
        }
        return shortcut;
      });
      setAppShortcuts(updatedAppShortcuts);
      toast.success('Atalho atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar atalho');
    } finally {
      setLoading(false);
    }
  };

  const deleteAppShortcut = (id: string) => {
    setLoading(true);
    try {
      // Verificar se o atalho não é do sistema antes de excluir
      const shortcutToDelete = appShortcuts.find(shortcut => shortcut.id === id);
      if (shortcutToDelete && shortcutToDelete.isSystemDefault) {
        toast.error('Não é possível excluir atalhos do sistema');
        setLoading(false);
        return;
      }
      
      setAppShortcuts(appShortcuts.filter(shortcut => shortcut.id !== id));
      toast.success('Atalho removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover atalho');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShortcutContext.Provider value={{ 
      appShortcuts, 
      addAppShortcut, 
      updateAppShortcut, 
      deleteAppShortcut,
      loading 
    }}>
      {children}
    </AppShortcutContext.Provider>
  );
}

export function useAppShortcuts() {
  const context = useContext(AppShortcutContext);
  if (context === undefined) {
    throw new Error('useAppShortcuts must be used within a AppShortcutProvider');
  }
  return context;
}
