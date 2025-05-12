
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRelease } from '@/contexts/ReleaseContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function ReleasePage() {
  const {
    releaseItems,
    updateItem,
    addItem,
    removeItem,
    moveItem,
    copyReleaseToClipboard,
    resetToDefault
  } = useRelease();
  
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-4">
          Edite os campos abaixo para gerar seu release. As alterações são salvas automaticamente.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {releaseItems.map((item) => (
          <div key={item.id} className="flex flex-col gap-1">
            <Textarea
              value={item.content}
              onChange={(e) => updateItem(item.id, e.target.value)}
              rows={1}
              className="w-full resize-none overflow-hidden transition-all"
              style={{
                minHeight: 'unset',
                height: Math.max(1, (item.content.match(/\n/g) || []).length + 1) * 24 + 'px'
              }}
            />
            <div className="flex flex-wrap gap-1 justify-start mt-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => moveItem(item.id, 'up')}
                className="h-8 w-8"
                title="Mover para cima"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => moveItem(item.id, 'down')}
                className="h-8 w-8"
                title="Mover para baixo"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => addItem(item.id, 'after')}
                className="h-8 w-8"
                title="Adicionar linha abaixo"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeItem(item.id)}
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                title="Remover linha"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <Button 
          onClick={copyReleaseToClipboard} 
          className="bg-police-blue hover:bg-police-lightBlue flex gap-2 items-center"
        >
          <Copy className="h-4 w-4" />
          Copiar Release
        </Button>
        <Button
          variant="outline"
          onClick={() => setResetDialogOpen(true)}
        >
          Resetar Modelo
        </Button>
      </div>

      {/* Reset confirmation dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resetar release?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá restaurar o modelo padrão do release. Todas as suas alterações serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetToDefault();
                setResetDialogOpen(false);
              }}
            >
              Resetar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ReleasePage;
