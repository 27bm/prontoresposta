
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface FilterBadgesProps {
  items: string[];
  activeItem: string | null;
  label: string;
  onItemClick: (item: string) => void;
  badgeClassName?: (active: boolean) => string;
}

export function FilterBadges({ 
  items, 
  activeItem, 
  onItemClick,
  badgeClassName = (active) => active ? "bg-police-blue hover:bg-police-lightBlue" : "hover:bg-gray-100"
}: FilterBadgesProps) {
  if (items.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge
          key={item}
          variant={activeItem === item ? "default" : "outline"}
          className={`cursor-pointer ${badgeClassName(activeItem === item)}`}
          onClick={() => onItemClick(item)}
        >
          {item}
          {activeItem === item && (
            <X 
              className="h-3 w-3 ml-1" 
              onClick={(e) => {
                e.stopPropagation();
                onItemClick(item); // This will toggle it off
              }}
            />
          )}
        </Badge>
      ))}
    </div>
  );
}
