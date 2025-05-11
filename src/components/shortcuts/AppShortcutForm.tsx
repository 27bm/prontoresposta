
import React, { useState, useEffect } from 'react';
import { AppShortcut } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface AppShortcutFormProps {
  appShortcut?: AppShortcut;
  onSave: (appShortcut: Omit<AppShortcut, 'id' | 'isSystemDefault'>) => void;
  onCancel: () => void;
}

export function AppShortcutForm({ appShortcut, onSave, onCancel }: AppShortcutFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState<string | undefined>(undefined);
  const [downloadUrl, setDownloadUrl] = useState('');
  
  // Se houver um atalho para edição, carregue os dados
  useEffect(() => {
    if (appShortcut) {
      setName(appShortcut.name);
      setDescription(appShortcut.description || '');
      setIconUrl(appShortcut.iconUrl);
      setDownloadUrl(appShortcut.downloadUrl);
    }
  }, [appShortcut]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      name,
      description: description || undefined,
      iconUrl,
      downloadUrl,
    });
  };
  
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Neste exemplo, simulamos um upload de arquivo
    // Em uma aplicação real, isso enviaria a imagem para um servidor
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setIconUrl(event.target.result);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do aplicativo*</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Nome do aplicativo" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Descrição do aplicativo..." 
          rows={3} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="downloadUrl">URL de download*</Label>
        <Input 
          id="downloadUrl" 
          value={downloadUrl} 
          onChange={(e) => setDownloadUrl(e.target.value)} 
          placeholder="https://play.google.com/store/apps/..." 
          required 
        />
        <p className="text-xs text-gray-500">
          Cole o link da Google Play Store, App Store ou outro site de download.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label>Ícone</Label>
        <div className="flex items-center p-4 border-2 border-dashed rounded-lg">
          {iconUrl ? (
            <div className="flex flex-1 justify-between items-center">
              <div className="flex items-center">
                <img 
                  src={iconUrl} 
                  alt="Ícone" 
                  className="w-12 h-12 rounded-md object-cover mr-4" 
                />
                <span className="text-sm">Ícone carregado</span>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIconUrl(undefined)}
              >
                Remover ícone
              </Button>
            </div>
          ) : (
            <div className="flex-1 text-center">
              <div className="relative inline-block">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center gap-2" 
                >
                  <Upload className="h-4 w-4" />
                  Carregar ícone
                </Button>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleIconUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-police-blue hover:bg-police-lightBlue">
          {appShortcut ? 'Atualizar' : 'Adicionar'} Atalho
        </Button>
      </div>
    </form>
  );
}
