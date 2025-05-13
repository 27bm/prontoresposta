
import React from 'react';
import { Suspect } from '@/types/models';
import { User } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface SuspectGalleryViewProps {
  suspects: Suspect[];
  onSelectSuspect: (suspect: Suspect) => void;
}

export function SuspectGalleryView({ suspects, onSelectSuspect }: SuspectGalleryViewProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {suspects.map((suspect) => (
        <div 
          key={suspect.id} 
          className="cursor-pointer rounded-md overflow-hidden border border-gray-200 hover:border-police-blue transition-colors"
          onClick={() => onSelectSuspect(suspect)}
        >
          <div className="relative">
            <AspectRatio ratio={1}>
              {suspect.photoUrl ? (
                <img 
                  src={suspect.photoUrl} 
                  alt={suspect.name} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <User className="w-1/3 h-1/3 text-gray-400" />
                </div>
              )}
            </AspectRatio>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1 text-xs text-white truncate">
              {suspect.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
