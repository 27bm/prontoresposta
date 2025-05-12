import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AppShortcut } from '../types/models';
import { toast } from 'sonner';

// Predefined app shortcuts
const initialAppShortcuts: AppShortcut[] = [
  {
    id: '1',
    name: 'BM MOB',
    downloadUrl: 'https://firebasestorage.googleapis.com/v0/b/pronto-resposta.appspot.com/o/ADM%2FBM_MOB.apk?alt=media&token=33b8aa9d-4557-4e3a-9548-559f68a138ed',
    isSystemDefault: true,
  },
  {
    id: '2',
    name: 'Consultas Policiais',
    downloadUrl: 'https://firebasestorage.googleapis.com/v0/b/pronto-resposta.appspot.com/o/ADM%2FConsultasPoliciais.apk?alt=media&token=e2ea7c48-f681-4a9f-a35b-1d44a75c583e',
    isSystemDefault: true,
  },
  {
    id: '3',
    name: 'Agente de Campo',
    downloadUrl: 'https://firebasestorage.googleapis.com/v0/b/pronto-resposta.appspot.com/o/ADM%2FAGENTE_CAMPO.apk?alt=media&token=8d2ae809-91e9-43a5-9d1c-e6595641ba20',
    isSystemDefault: true,
  },
  {
    id: '4',
    name: 'IPE Saúde',
    downloadUrl: 'https://firebasestorage.googleapis.com/v0/b/pronto-resposta.appspot.com/o/ADM%2FIPE_SAUDE.apk?alt=media&token=f0359d85-f36b-4706-837b-0ae4b5b47cf1',
    isSystemDefault: true,
  },
  {
    id: '5',
    name: 'IPVA RS',
    downloadUrl: 'https://firebasestorage.googleapis.com/v0/b/pronto-resposta.appspot.com/o/ADM%2FIPVA_RS.apk?alt=media&token=311bc828-2d45-4dec-aa4b-d31b024f30b9',
    isSystemDefault: true,
  },
  {
    id: '6',
    name: 'RED Móvel',
    downloadUrl: 'https://firebasestorage.googleapis.com/v0/b/pronto-resposta.appspot.com/o/ADM%2FRED_MOVEL.apk?alt=media&token=79ae4c95-d0a9-4e22-8dcb-23ecc677090f',
    isSystemDefault: true,
  },
  {
    id: '7',
    name: 'Servidor RS',
    downloadUrl: 'https://firebasestorage.googleapis.com/v0/b/pronto-resposta.appspot.com/o/ADM%2FSERVIDOR_RS.apk?alt=media&token=50199ce8-ef38-4166-ac6b-8453f7b06468',
    isSystemDefault: true,
  },
  {
    id: '8',
    name: 'Talonário Eletrônico',
    downloadUrl: 'https://firebasestorage.googleapis.com/v0/b/pronto-resposta.appspot.com/o/ADM%2FTALONARIO_ELETRONICO.apk?alt=media&token=376ad85d-14b1-4f23-bed9-1a3b39042cd3',
    isSystemDefault: true,
  },
  {
    id: '9',
    name: 'Ticket Log',
    downloadUrl: 'https://firebasestorage.googleapis.com/v0/b/pronto-resposta.appspot.com/o/ADM%2FTICKET_LOG.apk?alt=media&token=555c170c-e4ad-416a-b1b2-759bcb94b7c0',
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

  // Keep these methods for compatibility with other components
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
