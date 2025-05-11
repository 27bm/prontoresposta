
import React, { useEffect, useRef, useState } from 'react';
import { useMapMarkers } from '@/contexts/MapContext';
import { MapMarker } from '@/types/models';
import { toast } from 'sonner';

// Define the window with google maps
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMapComponent = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);
  const { markers, updateMarker } = useMapMarkers();
  const [mapError, setMapError] = useState<string | null>(null);

  // Função para inicializar o mapa
  const initializeMap = () => {
    if (!mapRef.current) return;

    try {
      // Coordenadas iniciais (Brasil)
      const center = { lat: -15.77972, lng: -47.92972 };
      
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 5,
        center,
        mapTypeId: 'roadmap',
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: false,
        zoomControl: true,
      });

      setMapInstance(map);

      // Adicionar evento de clique para adicionar marcadores
      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        const position = event.latLng;
        if (position) {
          toast.info('Clique no mapa detectado. Use o botão "Adicionar Ponto" para criar um novo marcador.');
        }
      });

      // Se chegou aqui, o mapa foi carregado com sucesso
      setMapError(null);
    } catch (error) {
      console.error("Erro ao inicializar o mapa:", error);
      setMapError("Erro ao carregar o mapa. Verifique a conexão e tente novamente.");
    }
  };

  // Atualizar marcadores no mapa
  const updateMapMarkers = () => {
    // Limpar todos os marcadores existentes
    mapMarkers.forEach(marker => marker.setMap(null));
    const newMapMarkers: google.maps.Marker[] = [];

    if (mapInstance) {
      // Adicionar novos marcadores
      markers.forEach(marker => {
        // Determinar ícone com base no tipo
        let icon = '';
        switch (marker.type) {
          case 'drug_dealing':
            icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
            break;
          case 'patrol':
            icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
            break;
          case 'incident':
            icon = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
            break;
          case 'custom':
            icon = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
            break;
          default:
            icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
        }

        const mapMarker = new window.google.maps.Marker({
          position: { lat: marker.latitude, lng: marker.longitude },
          map: mapInstance,
          title: marker.title,
          icon,
          draggable: true,
        });

        // Adicionar tooltip ao marcador
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div>
              <h3 style="font-weight: bold;">${marker.title}</h3>
              <p>${marker.description || ''}</p>
            </div>
          `,
        });

        mapMarker.addListener('click', () => {
          infoWindow.open(mapInstance, mapMarker);
        });

        // Evento para atualizar a posição do marcador quando arrastado
        mapMarker.addListener('dragend', () => {
          const position = mapMarker.getPosition();
          if (position) {
            updateMarker(marker.id, {
              latitude: position.lat(),
              longitude: position.lng(),
            });
          }
        });

        newMapMarkers.push(mapMarker);
      });

      setMapMarkers(newMapMarkers);
    }
  };

  // Carregar script do Google Maps
  useEffect(() => {
    // Limpar handler de erro anterior
    const originalOnError = window.onerror;
    
    // Configurar handler de erro para capturar erro de API do Google Maps
    window.onerror = (message) => {
      if (typeof message === 'string' && message.includes('Google Maps')) {
        setMapError("Erro ao carregar o Google Maps. Verifique a chave API.");
        return true; // Prevenir comportamento padrão
      }
      return false;
    };
    
    // Verificar se o script já foi carregado
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    window.initMap = initializeMap;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyChHNHmX1iDhla5qKkdB7w3YAgur72qJk8&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    // Adicionar evento de erro para o script
    script.onerror = () => {
      setMapError("Falha ao carregar o script do Google Maps. Verifique sua conexão.");
    };
    
    document.head.appendChild(script);

    return () => {
      window.initMap = () => {};
      window.onerror = originalOnError;
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  // Atualizar marcadores quando os dados mudarem ou o mapa for inicializado
  useEffect(() => {
    if (mapInstance) {
      updateMapMarkers();
    }
  }, [markers, mapInstance]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full"></div>
      {mapError && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center p-4">
          <p className="text-red-600 font-bold mb-2">Erro ao carregar o mapa</p>
          <p className="text-center">{mapError}</p>
          <button 
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;
