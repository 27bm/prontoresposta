
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapMarkerForm } from '@/components/map/MapMarkerForm';
import { useMapMarkers } from '@/contexts/MapContext';
import { MapMarker } from '@/types/models';
import { Map, Pin, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';

export function MapPage() {
  const { markers, addMarker, updateMarker, deleteMarker, loading } = useMapMarkers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMarker, setCurrentMarker] = useState<MapMarker | undefined>(undefined);
  const [markerToDelete, setMarkerToDelete] = useState<string | null>(null);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(true);
  
  // Mock do mapa (em uma aplicação real, isso seria um componente de mapa real)
  // Apenas para fins de demonstração
  const mapPlaceholder = (
    <div className="relative bg-gray-200 aspect-video w-full rounded-lg overflow-hidden flex items-center justify-center">
      <Map className="w-16 h-16 text-gray-400" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-gray-600 bg-white/80 p-3 rounded-lg shadow-md">
          O mapa interativo seria integrado aqui com a API do Google Maps
        </p>
      </div>
      
      {/* Simulação de marcadores no mapa */}
      {markers.map((marker) => {
        // Calculamos posições aleatórias para os marcadores na visulização de exemplo
        const top = Math.random() * 80 + 10;
        const left = Math.random() * 80 + 10;
        
        let pinColor = "text-red-500";
        
        switch (marker.type) {
          case "drug_dealing":
            pinColor = "text-red-500";
            break;
          case "patrol":
            pinColor = "text-blue-500";
            break;
          case "incident":
            pinColor = "text-yellow-500";
            break;
          case "custom":
            pinColor = "text-purple-500";
            break;
        }
        
        return (
          <div
            key={marker.id}
            className="absolute cursor-pointer animate-pulse-slow"
            style={{ top: `${top}%`, left: `${left}%` }}
            onClick={() => handleEditClick(marker)}
          >
            <Pin className={`h-8 w-8 ${pinColor}`} />
          </div>
        );
      })}
    </div>
  );
  
  // Funções de manipulação do formulário
  const handleAddClick = () => {
    setCurrentMarker(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditClick = (marker: MapMarker) => {
    setCurrentMarker(marker);
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = (id: string) => {
    setMarkerToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (markerToDelete) {
      deleteMarker(markerToDelete);
      setMarkerToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleFormSave = (marker: Omit<MapMarker, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (currentMarker) {
      updateMarker(currentMarker.id, marker);
    } else {
      addMarker(marker);
    }
    
    setIsFormOpen(false);
  };
  
  // Renderizar ícone com base no tipo de marcador
  const renderMarkerIcon = (type: MapMarker['type']) => {
    switch (type) {
      case 'drug_dealing':
        return <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>;
      case 'patrol':
        return <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>;
      case 'incident':
        return <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>;
      case 'custom':
        return <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>;
      default:
        return <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>;
    }
  };
  
  // Renderizar nome com base no tipo de marcador
  const renderMarkerTypeName = (type: MapMarker['type']) => {
    switch (type) {
      case 'drug_dealing':
        return 'Ponto de tráfico';
      case 'patrol':
        return 'Rota de patrulha';
      case 'incident':
        return 'Ocorrência';
      case 'custom':
        return 'Personalizado';
      default:
        return 'Desconhecido';
    }
  };
  
  return (
    <div className="space-y-4">
      {mapPlaceholder}
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Pontos Marcados ({markers.length})</h3>
        <Button
          onClick={handleAddClick}
          className="bg-police-blue hover:bg-police-lightBlue"
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Ponto
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse-slow text-center">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      ) : markers.length > 0 ? (
        <div className="space-y-2">
          {markers.map((marker) => (
            <Card key={marker.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      {renderMarkerIcon(marker.type)}
                      <span className="text-sm text-gray-500">{renderMarkerTypeName(marker.type)}</span>
                    </div>
                    <h3 className="font-medium">{marker.title}</h3>
                    
                    {marker.description && (
                      <p className="text-sm text-gray-600 mt-1">{marker.description}</p>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Lat: {marker.latitude.toFixed(6)}, Long: {marker.longitude.toFixed(6)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(marker)}
                      className="text-blue-600"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(marker.id)}
                      className="text-red-600"
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum ponto marcado no mapa</p>
          <Button
            onClick={handleAddClick}
            className="mt-4 bg-police-blue hover:bg-police-lightBlue"
          >
            Adicionar Primeiro Ponto
          </Button>
        </div>
      )}
      
      {/* Modal do formulário */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentMarker ? 'Editar Marcador' : 'Adicionar Novo Marcador'}
            </DialogTitle>
          </DialogHeader>
          <MapMarkerForm
            marker={currentMarker}
            onSave={handleFormSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de informação sobre o mapa */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Sobre o Mapa Interativo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p>
              Esta é uma representação visual do que seria o mapa interativo. Em uma aplicação real, 
              este componente usaria a API do Google Maps para:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Visualizar mapa em tempo real</li>
              <li>Adicionar marcadores com cliques no mapa</li>
              <li>Personalizar cores e ícones dos marcadores</li>
              <li>Salvar localização dos marcadores com precisão</li>
            </ul>
            <p>
              Nesta demonstração, você pode adicionar, editar e excluir marcadores para simular 
              a funcionalidade que estaria disponível com a integração completa do Google Maps.
            </p>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setIsInfoDialogOpen(false)}>
                Entendi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este marcador? Esta ação não pode ser desfeita.
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

export default MapPage;
