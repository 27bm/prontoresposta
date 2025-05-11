
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MapMarker } from '../types/models';
import { toast } from 'sonner';

// Mock data para exemplificar marcadores do mapa
const initialMarkers: MapMarker[] = [
  {
    id: '1',
    latitude: -23.550520,
    longitude: -46.633308,
    title: 'Ponto de tráfico conhecido',
    description: 'Área com histórico de venda de drogas, principalmente no período noturno.',
    type: 'drug_dealing',
    createdAt: new Date(2023, 4, 15),
    updatedAt: new Date(2023, 4, 15),
  },
  {
    id: '2',
    latitude: -23.545590,
    longitude: -46.639847,
    title: 'Rota de patrulhamento',
    description: 'Rota prioritária para patrulhamento ostensivo - região comercial.',
    type: 'patrol',
    createdAt: new Date(2023, 3, 22),
    updatedAt: new Date(2023, 3, 22),
  },
];

interface MapContextType {
  markers: MapMarker[];
  addMarker: (marker: Omit<MapMarker, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMarker: (id: string, marker: Partial<MapMarker>) => void;
  deleteMarker: (id: string) => void;
  loading: boolean;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [markers, setMarkers] = useState<MapMarker[]>(initialMarkers);
  const [loading, setLoading] = useState(false);

  const addMarker = (marker: Omit<MapMarker, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const newMarker: MapMarker = {
        ...marker,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setMarkers([...markers, newMarker]);
      toast.success('Marcador adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar marcador');
    } finally {
      setLoading(false);
    }
  };

  const updateMarker = (id: string, updatedFields: Partial<MapMarker>) => {
    setLoading(true);
    try {
      const updatedMarkers = markers.map(marker => {
        if (marker.id === id) {
          return { 
            ...marker, 
            ...updatedFields,
            updatedAt: new Date() 
          };
        }
        return marker;
      });
      setMarkers(updatedMarkers);
      toast.success('Marcador atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar marcador');
    } finally {
      setLoading(false);
    }
  };

  const deleteMarker = (id: string) => {
    setLoading(true);
    try {
      setMarkers(markers.filter(marker => marker.id !== id));
      toast.success('Marcador removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover marcador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MapContext.Provider value={{ 
      markers, 
      addMarker, 
      updateMarker, 
      deleteMarker,
      loading 
    }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapMarkers() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapMarkers must be used within a MapProvider');
  }
  return context;
}
