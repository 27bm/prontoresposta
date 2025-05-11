
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AppShortcutCard } from '@/components/shortcuts/AppShortcutCard';
import { AppShortcutForm } from '@/components/shortcuts/AppShortcutForm';
import { useAppShortcuts } from '@/contexts/AppShortcutContext';
import { AppShortcut } from '@/types/models';
import { Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export function ShortcutsPage() {
  const { appShortcuts, addAppShortcut, updateAppShortcut, deleteAppShortcut, loading } = useAppShortcuts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentShortcut, setCurrentShortcut] = useState<AppShortcut | undefined>(undefined);
  const [shortcutToDelete, setShortcutToDelete] = useState<string | null>(null);
  
  // Funções de manipulação do formulário
  const handleAddClick = () => {
    setCurrentShortcut(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditClick = (shortcut: AppShortcut) => {
    setCurrentShortcut(shortcut);
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = (id: string) => {
    setShortcutToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (shortcutToDelete) {
      deleteAppShortcut(shortcutToDelete);
      setShortcutToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleFormSave = (shortcut: Omit<AppShortcut, 'id' | 'isSystemDefault'>) => {
    if (currentShortcut) {
      updateAppShortcut(currentShortcut.id, shortcut);
    } else {
      addAppShortcut(shortcut);
    }
    
    setIsFormOpen(false);
  };
  
  // Separar atalhos do sistema dos personalizados
  const systemShortcuts = appShortcuts.filter(shortcut => shortcut.isSystemDefault);
  const customShortcuts = appShortcuts.filter(shortcut => !shortcut.isSystemDefault);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Atalhos para Aplicativos</h2>
        <Button
          onClick={handleAddClick}
          className="bg-police-blue hover:bg-police-lightBlue"
        >
          <Plus className="h-4 w-4 mr-1" />
          Novo Atalho
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse-slow text-center">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      ) : (
        <>
          {systemShortcuts.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-600 mb-3">Aplicativos Recomendados</h3>
              <div className="space-y-3">
                {systemShortcuts.map((shortcut) => (
                  <AppShortcutCard
                    key={shortcut.id}
                    appShortcut={shortcut}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </div>
          )}
          
          {customShortcuts.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-600 mb-3">Seus Atalhos</h3>
              <div className="space-y-3">
                {customShortcuts.map((shortcut) => (
                  <AppShortcutCard
                    key={shortcut.id}
                    appShortcut={shortcut}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </div>
          )}
          
          {customShortcuts.length === 0 && (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">Você ainda não adicionou nenhum atalho personalizado</p>
              <Button
                onClick={handleAddClick}
                className="bg-police-blue hover:bg-police-lightBlue"
              >
                Adicionar Atalho
              </Button>
            </div>
          )}
        </>
      )}
      
      {/* Modal do formulário */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentShortcut && !currentShortcut.isSystemDefault ? 'Editar Atalho' : 'Adicionar Novo Atalho'}
            </DialogTitle>
          </DialogHeader>
          <AppShortcutForm
            appShortcut={currentShortcut && !currentShortcut.isSystemDefault ? currentShortcut : undefined}
            onSave={handleFormSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este atalho? Esta ação não pode ser desfeita.
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

export default ShortcutsPage;
