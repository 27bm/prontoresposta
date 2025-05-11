
import React from 'react';
import { AppShortcut } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Edit, Trash, Smartphone } from 'lucide-react';

interface AppShortcutCardProps {
  appShortcut: AppShortcut;
  onEdit: (appShortcut: AppShortcut) => void;
  onDelete: (id: string) => void;
}

export function AppShortcutCard({ appShortcut, onEdit, onDelete }: AppShortcutCardProps) {
  const handleDownload = () => {
    // Em uma aplicação real, abriria a URL da loja de aplicativos
    window.open(appShortcut.downloadUrl, '_blank');
  };
  
  return (
    <Card className="mb-3 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            {appShortcut.iconUrl ? (
              <img 
                src={appShortcut.iconUrl} 
                alt={appShortcut.name} 
                className="w-12 h-12 rounded-md object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-md bg-police-blue flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold">{appShortcut.name}</h3>
            
            {appShortcut.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {appShortcut.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600" 
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          
          {!appShortcut.isSystemDefault && (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600" 
                onClick={() => onEdit(appShortcut)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600" 
                onClick={() => onDelete(appShortcut.id)}
              >
                <Trash className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
