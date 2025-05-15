
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TokenDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tokenInput: string;
  setTokenInput: (token: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function TokenDialog({
  isOpen,
  onOpenChange,
  tokenInput,
  setTokenInput,
  onSubmit
}: TokenDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-police-blue">
            Acesso à Lista de Suspeitos
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Informe um token para acessar uma lista de suspeitos existente. Se o token não existir, uma nova lista será criada.
            </p>
            <Input 
              value={tokenInput} 
              onChange={(e) => setTokenInput(e.target.value)} 
              placeholder="Digite o token de acesso"
              required
              className="border-gray-300 focus:border-police-blue text-gray-800"
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">
              Acessar Lista
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
