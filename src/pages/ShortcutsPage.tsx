
import React from 'react';
import { AppShortcutCard } from '@/components/shortcuts/AppShortcutCard';
import { useAppShortcuts } from '@/contexts/AppShortcutContext';
import { AppShortcut } from '@/types/models';

export function ShortcutsPage() {
  const { appShortcuts, loading } = useAppShortcuts();
  
  // Functions needed for the AppShortcutCard props, but won't be used
  const handleEditClick = (shortcut: AppShortcut) => {
    // This function won't be used but is needed for the component
  };
  
  const handleDeleteClick = (id: string) => {
    // This function won't be used but is needed for the component
  };
  
  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse-slow text-center">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {appShortcuts.map((shortcut) => (
            <AppShortcutCard
              key={shortcut.id}
              appShortcut={shortcut}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ShortcutsPage;
