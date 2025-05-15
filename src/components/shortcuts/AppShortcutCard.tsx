
import React from 'react';
import { AppShortcut } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Heart, FileText, Phone, Server, Ticket, User, Shield } from 'lucide-react';

interface AppShortcutCardProps {
  appShortcut: AppShortcut;
  onEdit: (appShortcut: AppShortcut) => void;
  onDelete: (id: string) => void;
}

export function AppShortcutCard({ appShortcut, onEdit, onDelete }: AppShortcutCardProps) {
  const handleDownload = () => {
    window.open(appShortcut.downloadUrl, '_blank');
  };
  
  // Function to determine which icon to use based on app name
  const getAppIcon = () => {
    const appName = appShortcut.name.toLowerCase();
    if (appName.includes('bm mob')) return Smartphone;
    if (appName.includes('consultas policiais')) return Shield;
    if (appName.includes('agente de campo')) return User;
    if (appName.includes('ipe saúde')) return Heart;
    if (appName.includes('ipva')) return FileText;
    if (appName.includes('red móvel')) return Phone;
    if (appName.includes('servidor')) return Server;
    if (appName.includes('talonário')) return FileText;
    if (appName.includes('ticket')) return Ticket;
    return Smartphone; // Default icon
  };
  
  const AppIcon = getAppIcon();
  
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
                <AppIcon className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-black">{appShortcut.name}</h3>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600 w-full" 
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
